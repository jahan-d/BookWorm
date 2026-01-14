class BookController {
    constructor(models) {
        this.Book = models.Book;
        this.Review = models.Review;
        this.Genre = models.Genre;
    }

    async getBooks(req, res) {
        try {
            const filters = {
                search: req.query.search,
                genre: req.query.genre,
                rating: req.query.rating,
                sortBy: req.query.sortBy,
                limit: parseInt(req.query.limit) || 20,
                skip: parseInt(req.query.skip) || 0
            };
            const books = await this.Book.findAll(filters);
            res.send(books);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching books', error: error.message });
        }
    }

    async getBookDetails(req, res) {
        try {
            const id = req.params.id;
            const userEmail = req.user?.email;

            const book = await this.Book.findById(id);
            if (!book) return res.status(404).send({ message: 'Book not found' });

            // Fetch all approved reviews
            let reviews = [];
            try {
                reviews = await this.Review.findByBookId(id);
            } catch (err) {
                console.error('Error fetching approved reviews:', err);
            }

            // Fetch user's own reviews if they exist (even if pending/rejected)
            // Use instance method if available, fallback to collection access
            if (userEmail) {
                try {
                    const userReviews = await this.Review.collection.find({
                        bookId: id,
                        userEmail: userEmail,
                        status: { $ne: 'approved' }
                    }).toArray();
                    reviews = [...reviews, ...userReviews];
                } catch (err) {
                    console.error('Error fetching user own reviews:', err);
                }
            }

            // Sanitization: Remove emails from others' reviews for privacy
            const sanitizedReviews = reviews.map(r => {
                const review = { ...r };
                // Ensure review is not just the MongoDB ID if map is used on non-objects
                if (typeof review !== 'object' || review === null) return review;

                if (review.userEmail !== userEmail) {
                    delete review.userEmail;
                }
                return review;
            });

            res.send({ ...book, reviews: sanitizedReviews });
        } catch (error) {
            console.error('Fatal error in getBookDetails:', error);
            res.status(500).send({ message: 'Error fetching book details', error: error.message });
        }
    }

    async addBook(req, res) {
        try {
            const bookData = req.body;

            // Auto-add Genre if it doesn't exist
            if (bookData.genre) {
                const existingGenre = await this.Genre.findByName(bookData.genre);
                if (!existingGenre) {
                    await this.Genre.create(bookData.genre);
                }
            }

            const result = await this.Book.create(bookData);
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error adding book', error: error.message });
        }
    }

    async updateBook(req, res) {
        try {
            const id = req.params.id;
            const updateData = req.body;

            // Auto-add Genre if it doesn't exist
            if (updateData.genre) {
                const existingGenre = await this.Genre.findByName(updateData.genre);
                if (!existingGenre) {
                    await this.Genre.create(updateData.genre);
                }
            }

            const result = await this.Book.update(id, updateData);
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error updating book', error: error.message });
        }
    }

    async deleteBook(req, res) {
        try {
            const id = req.params.id;
            const result = await this.Book.delete(id);
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error deleting book', error: error.message });
        }
    }
}

module.exports = BookController;
