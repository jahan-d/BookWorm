const AuthController = require('./authController');
const BookController = require('./bookController');
const UserController = require('./userController');
const AdminController = require('./adminController');
const ReviewController = require('./reviewController');
const TutorialController = require('./tutorialController');

function initializeControllers(models, collections) {
    return {
        auth: new AuthController(models),
        book: new BookController(models),
        user: new UserController(models),
        admin: new AdminController(models, collections),
        review: new ReviewController(models),
        tutorial: new TutorialController(models)
    };
}

module.exports = { initializeControllers };
