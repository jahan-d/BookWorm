class AdminController {
    constructor(models, collections) {
        this.User = models.User;
        this.Book = models.Book;
        this.Genre = models.Genre;
        this.Review = models.Review;
        this.Tutorial = models.Tutorial;
        this.collections = collections;
    }

    async getStats(req, res) {
        try {
            const totalBooks = await this.collections.books.countDocuments();
            const totalUsers = await this.collections.users.countDocuments();
            const pendingReviews = await this.collections.reviews.countDocuments({ status: 'pending' });

            // Books per genre (aggregation)
            const booksPerGenre = await this.collections.books.aggregate([
                { $group: { _id: '$genre', count: { $sum: 1 } } }
            ]).toArray();

            res.send({ totalBooks, totalUsers, pendingReviews, booksPerGenre });
        } catch (error) {
            res.status(500).send({ message: 'Error fetching stats', error: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const searchText = req.query.searchText;
            const users = await this.User.findAll(searchText);
            res.send(users);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching users', error: error.message });
        }
    }

    async updateUserRole(req, res) {
        try {
            const id = req.params.id;
            const { role } = req.body;
            const result = await this.User.updateRole(id, role);
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error updating role', error: error.message });
        }
    }

    async moderateReview(req, res) {
        try {
            const { id, action } = req.body; // action: 'approve' or 'delete'
            if (action === 'approve') {
                const result = await this.Review.approve(id);
                res.send(result);
            } else {
                const result = await this.Review.delete(id);
                res.send(result);
            }
        } catch (error) {
            res.status(500).send({ message: 'Error moderating review', error: error.message });
        }
    }

    async getPendingReviews(req, res) {
        try {
            const reviews = await this.collections.reviews.find({ status: 'pending' }).toArray();
            res.send(reviews);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching pending reviews', error: error.message });
        }
    }

    async manageGenres(req, res) {
        try {
            const genres = await this.Genre.getAll();
            res.send(genres);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching genres', error: error.message });
        }
    }

    async addGenre(req, res) {
        try {
            const { name } = req.body;
            const result = await this.Genre.create(name);
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error adding genre', error: error.message });
        }
    }

    async manageTutorials(req, res) {
        try {
            const tutorials = await this.Tutorial.getAll();
            res.send(tutorials);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching tutorials', error: error.message });
        }
    }

    async addTutorial(req, res) {
        try {
            const tutorialData = req.body;
            const result = await this.Tutorial.create(tutorialData);
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error adding tutorial', error: error.message });
        }
    }
}

module.exports = AdminController;
