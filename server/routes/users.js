const { verifyToken } = require('../middleware/auth');

function userRoutes(app, controllers) {
    const userController = controllers.user;

    // Get current user profile
    app.get('/users/me', verifyToken, (req, res) => userController.getProfile(req, res));

    // Update profile (name, photoURL)
    app.put('/users/profile', verifyToken, (req, res) => userController.updateProfile(req, res));

    // Get user reviews
    app.get('/users/reviews', verifyToken, (req, res) => userController.getMyReviews(req, res));

    // Update shelf
    app.put('/users/shelf', verifyToken, (req, res) => userController.updateShelf(req, res));

    // Update reading progress
    app.put('/users/progress', verifyToken, (req, res) => userController.updateProgress(req, res));

    // Get user library/shelves
    app.get('/users/library', verifyToken, (req, res) => userController.getLibrary(req, res));

    // Get recommendations
    app.get('/users/recommendations', verifyToken, (req, res) => userController.getRecommendations(req, res));

    // Update Reading Goal
    app.put('/users/goal', verifyToken, (req, res) => userController.updateGoal(req, res));

    // Get Reading Stats
    app.get('/users/stats', verifyToken, (req, res) => userController.getStats(req, res));

    // Get users for discovery
    app.get('/users', verifyToken, (req, res) => userController.getDiscoveryUsers(req, res));

    // Follow User
    app.post('/users/follow', verifyToken, (req, res) => userController.followUser(req, res));

    // Activity Feed
    app.get('/users/feed', verifyToken, (req, res) => userController.getActivityFeed(req, res));

    // Submit Review
    app.post('/reviews', verifyToken, (req, res) => controllers.review.submitReview(req, res));

    // Get Tutorials (Public/Protected) - Now Protected
    app.get('/tutorials', verifyToken, (req, res) => controllers.tutorial.getTutorials(req, res));
}

module.exports = userRoutes;
