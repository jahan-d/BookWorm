const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDatabase } = require('./config/database');
const { attachCollections } = require('./middleware/collections');
const { initializeModels } = require('./models');
const { initializeControllers } = require('./controllers');

// Import routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS Configuration
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allow local dev
    credentials: true, // Allow cookies/auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Root endpoint
app.get('/', (req, res) => {
    res.send('BookWorm API is running!')
});

// Initialize database and start server
// Initialize database and start server
let isReady = false;
let initPromise = null;

async function initApp() {
    if (isReady) return;
    if (initPromise) return initPromise;

    initPromise = (async () => {
        try {
            // Connect to database
            const { collections } = await connectDatabase();

            // Attach collections to all requests
            app.use(attachCollections(collections));

            // Initialize models and controllers
            const models = initializeModels(collections);
            const controllers = initializeControllers(models, collections);

            // Register all routes
            authRoutes(app, controllers);
            bookRoutes(app, controllers);
            userRoutes(app, controllers);
            adminRoutes(app, controllers);

            isReady = true;
            console.log('App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            initPromise = null; // Allow retry
            throw error;
        }
    })();

    return initPromise;
}

// Start server locally
if (process.env.NODE_ENV !== 'production') {
    initApp().then(() => {
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    });
}

// Export for Vercel
module.exports = async (req, res) => {
    await initApp();
    app(req, res);
};
