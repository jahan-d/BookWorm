const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI || `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sqaiicy.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    serverSelectionTimeoutMS: 5000,
});

async function connectDatabase() {
    try {
        await client.connect();
        const db = client.db('bookworm_db');
        return {
            db,
            collections: {
                users: db.collection('users'),
                books: db.collection('books'),
                genres: db.collection('genres'),
                reviews: db.collection('reviews'),
                tutorials: db.collection('tutorials'),
                activities: db.collection('activities')
            }
        };
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

module.exports = { connectDatabase, client };
