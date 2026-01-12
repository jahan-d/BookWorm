class ReviewController {
    constructor(models) {
        this.Review = models.Review;
        this.Book = models.Book;
        this.Activity = models.Activity;
    }

    async submitReview(req, res) {
        try {
            const email = req.user.email;
            const { bookId, rating, text } = req.body;

            const reviewData = {
                bookId,
                userName: req.user.name, // Force REAL name from DB for identity enforcement
                userEmail: email,
                rating: parseInt(rating),
                text,
            };

            const result = await this.Review.create(reviewData);

            // Log as activity
            await this.Activity.log({
                userEmail: email,
                userName: req.user.name,
                action: 'reviewed_book',
                details: `Rated book ${bookId} with ${rating} stars`
            });

            // Also update the book's average rating
            await this.Book.updateRating(bookId, email, parseInt(rating));

            res.status(201).send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error submitting review', error: error.message });
        }
    }

    async getApprovedReviews(req, res) {
        try {
            const bookId = req.params.bookId;
            const reviews = await this.Review.findByBookId(bookId);
            res.send(reviews);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching reviews', error: error.message });
        }
    }
}

module.exports = ReviewController;
