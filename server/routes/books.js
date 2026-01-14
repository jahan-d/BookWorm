const { verifyToken, verifyAdmin } = require('../middleware/auth');

function bookRoutes(app, controllers) {
    const bookController = controllers.book;

    // Get all books (Public)
    app.get('/books', (req, res) => bookController.getBooks(req, res));

    // Get book details (Public, but optional auth for user reviews)
    const { verifyTokenOptional } = require('../middleware/auth');
    app.get('/books/:id', verifyTokenOptional, (req, res) => bookController.getBookDetails(req, res));

    // Admin: Add book
    app.post('/books', verifyToken, verifyAdmin, (req, res) => bookController.addBook(req, res));

    // Admin: Update book
    app.put('/books/:id', verifyToken, verifyAdmin, (req, res) => bookController.updateBook(req, res));

    // Admin: Delete book
    app.delete('/books/:id', verifyToken, verifyAdmin, (req, res) => bookController.deleteBook(req, res));
}

module.exports = bookRoutes;
