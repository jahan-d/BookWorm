const { verifyToken, verifyAdmin } = require('../middleware/auth');

function adminRoutes(app, controllers) {
    const adminController = controllers.admin;

    // Dashboard Stats
    app.get('/admin/stats', verifyToken, verifyAdmin, (req, res) => adminController.getStats(req, res));

    // Manage Users
    app.get('/admin/users', verifyToken, verifyAdmin, (req, res) => adminController.getAllUsers(req, res));
    app.patch('/admin/users/:id/role', verifyToken, verifyAdmin, (req, res) => adminController.updateUserRole(req, res));

    // Moderate Reviews
    app.get('/admin/reviews', verifyToken, verifyAdmin, (req, res) => adminController.getPendingReviews(req, res));
    app.post('/admin/reviews/moderate', verifyToken, verifyAdmin, (req, res) => adminController.moderateReview(req, res));

    // Manage Genres
    app.get('/admin/genres', verifyToken, verifyAdmin, (req, res) => adminController.manageGenres(req, res));
    app.post('/admin/genres', verifyToken, verifyAdmin, (req, res) => adminController.addGenre(req, res));

    // Manage Tutorials
    app.get('/admin/tutorials', verifyToken, verifyAdmin, (req, res) => controllers.tutorial.getTutorials(req, res));
    app.post('/admin/tutorials', verifyToken, verifyAdmin, (req, res) => controllers.tutorial.addTutorial(req, res));
    app.delete('/admin/tutorials/:id', verifyToken, verifyAdmin, (req, res) => controllers.tutorial.deleteTutorial(req, res));
}

module.exports = adminRoutes;
