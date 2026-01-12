function authRoutes(app, controllers) {
    const authController = controllers.auth;

    // Registration
    // Registration
    app.post('/auth/register', (req, res) => authController.register(req, res));

    // Login (Get Token)
    app.post('/auth/login', (req, res) => authController.login(req, res));

    // Get Profile (Protected)
    // We need verifyToken here. It's technically global middleware but usually simpler to import
    // However, routes are defined with controller access. Middleware is usually available in app scope.
    // Let's assume index.js passes it or we import it.
    // Wait, authRoutes is a function. I'll import it here.
    const { verifyToken } = require('../middleware/auth');
    app.get('/auth/me', verifyToken, (req, res) => authController.me(req, res));
}

module.exports = authRoutes;
