const { verifyToken, verifyAdmin } = require('../middleware/auth');

function bookRoutes(app, controllers) {
    const bookController = controllers.book;

    // Get all books (Protected)
    app.get('/books', verifyToken, (req, res) => bookController.getBooks(req, res));

    // Get book details (Protected)
    app.get('/books/:id', verifyToken, (req, res) => bookController.getBookDetails(req, res));

    // Admin: Add book
    app.post('/books', verifyToken, verifyAdmin, (req, res) => bookController.addBook(req, res));

    // Admin: Update book
    app.put('/books/:id', verifyToken, verifyAdmin, (req, res) => bookController.updateBook(req, res));

    // Admin: Delete book
    app.delete('/books/:id', verifyToken, verifyAdmin, (req, res) => bookController.deleteBook(req, res));
}

module.exports = bookRoutes;
