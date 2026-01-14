class UserController {
    constructor(models) {
        this.User = models.User;
        this.Book = models.Book;
        this.Activity = models.Activity;
    }

    async getProfile(req, res) {
        try {
            const user = req.user; // Use already populated user from verifyToken
            res.send(user);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching profile', error: error.message });
        }
    }

    async getMyReviews(req, res) {
        try {
            const email = req.user.email;
            const reviews = await this.User.collection.db.collection('reviews').find({ userEmail: email }).toArray();
            res.send(reviews);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching your reviews', error: error.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const email = req.user.email;
            const { name, photoURL } = req.body;

            const updateData = {};
            if (name) updateData.name = name;
            if (photoURL) updateData.photoURL = photoURL;

            const result = await this.User.collection.updateOne(
                { email },
                { $set: updateData }
            );
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error updating profile', error: error.message });
        }
    }

    async updateShelf(req, res) {
        try {
            const email = req.user.email;
            const { bookId, shelfName } = req.body;
            const result = await this.User.updateShelf(email, bookId, shelfName);

            // Log as activity
            await this.Activity.log({
                userEmail: email,
                userName: req.user.name,
                action: 'shelf_update',
                details: `Added book ${bookId} to ${shelfName} shelf`
            });

            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error updating shelf', error: error.message });
        }
    }

    async updateProgress(req, res) {
        try {
            const email = req.user.email;
            const { bookId, pagesRead } = req.body;

            // Mandatory Progress Math: progress = min(pagesRead, book.pages)
            const book = await this.Book.findById(bookId);
            if (!book) return res.status(404).send({ message: 'Book not found' });

            const clampedPages = Math.min(parseInt(pagesRead), book.pages || 0);

            const result = await this.User.updateProgress(email, bookId, clampedPages);
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error updating progress', error: error.message });
        }
    }

    async updateGoal(req, res) {
        try {
            const email = req.user.email; // Use req.user from verifyToken
            const { readingGoal } = req.body;

            // Standardizing to top-level readingGoal as per migration
            const result = await this.User.collection.updateOne(
                { email },
                { $set: { readingGoal: parseInt(readingGoal) } }
            );
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error updating goal', error: error.message });
        }
    }

    async getLibrary(req, res) {
        try {
            const email = req.user.email;
            const user = req.user;
            res.send(user.shelves);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching library', error: error.message });
        }
    }

    async getStats(req, res) {
        try {
            const email = req.user.email;
            const user = req.user;

            const totalBooksRead = user.shelves?.read?.length || 0;

            // Calculate total pages read from "read" shelf and current progress in "currentlyReading"
            let totalPagesRead = 0;

            // 1. Pages from finished books
            const readBooks = await Promise.all((user.shelves?.read || []).map(item => this.Book.findById(item.bookId)));
            readBooks.filter(b => b).forEach(b => { totalPagesRead += (b.pages || 0); });

            // 2. Pages from currently reading
            (user.shelves?.currentlyReading || []).forEach(item => {
                totalPagesRead += (item.progress || 0);
            });

            // Calculate average rating given by user
            const userReviews = await this.User.collection.db.collection('reviews').find({ userEmail: email }).toArray();
            const averageRatingGiven = userReviews.length > 0
                ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1)
                : 'N/A';

            res.send({
                booksReadThisYear: totalBooksRead,
                totalPagesRead,
                averageRatingGiven,
                readingGoal: user.readingGoal || 0,
                goalProgress: totalBooksRead
            });
        } catch (error) {
            res.status(500).send({ message: 'Error fetching stats', error: error.message });
        }
    }

    async followUser(req, res) {
        try {
            const email = req.user.email;
            const { targetEmail } = req.body;
            const result = await this.User.follow(email, targetEmail);

            // Log as activity
            await this.Activity.log({
                userEmail: email,
                userName: req.user.name,
                action: 'started_following',
                details: `Followed user ${targetEmail}`
            });

            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error following user', error: error.message });
        }
    }

    async getActivityFeed(req, res) {
        try {
            const email = req.user.email;
            const user = await this.User.findByEmail(email);
            const following = user.following || [];

            const feed = await this.Activity.getFeed([...following, email]);
            res.send(feed);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching activity feed', error: error.message });
        }
    }

    async getDiscoveryUsers(req, res) {
        try {
            const currentUserEmail = req.user.email;
            const users = await this.User.collection.find(
                { email: { $ne: currentUserEmail } },
                { projection: { name: 1, email: 1, photoURL: 1 } }
            ).limit(5).toArray();
            res.send(users);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching discovery users' });
        }
    }

    async getRecommendations(req, res) {
        try {
            const email = req.user.email;
            const user = await this.User.findByEmail(email);
            if (!user) return res.status(404).send({ message: 'User not found' });

            const readShelf = user.shelves?.read || [];

            // Fallback: If user has < 3 books in 'Read', show popular books
            if (readShelf.length < 3) {
                const fallbackBooks = await this.Book.findAll({ sortBy: 'rating', limit: 18 });
                return res.send(fallbackBooks);
            }

            // 1. Get genres from 'Read' shelf
            const readBooks = await Promise.all(
                readShelf.map(item => this.Book.findById(item.bookId || item))
            );

            const genreCounts = {};
            readBooks.filter(b => b).forEach(book => {
                if (book.genre) {
                    genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
                }
            });

            // 2. Find most common genre
            const topGenre = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b);

            // 3. Recommended books in that genre, excluding already read
            const recommendations = await this.Book.findAll({
                genre: topGenre,
                limit: 18
            });

            const filteredRecs = recommendations.filter(b => !readShelf.includes(b._id.toString()));

            // If we don't have enough genre matches, mix in popular
            if (filteredRecs.length < 12) {
                const popular = await this.Book.findAll({ sortBy: 'rating', limit: 12 });
                const mixed = [...new Set([...filteredRecs, ...popular])].slice(0, 18);
                return res.send(mixed);
            }

            res.send(filteredRecs.slice(0, 18));
        } catch (error) {
            res.status(500).send({ message: 'Error fetching recommendations', error: error.message });
        }
    }
}

module.exports = UserController;
