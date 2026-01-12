const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized access' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Critical Security Check: Retrieve user from DB
        // Do not trust the token payload for role/status
        if (!req.collections || !req.collections.users) {
            console.error('Database collections not available in verifyToken');
            return res.status(500).send({ message: 'Internal Server Error' });
        }

        // Verify user exists and get fresh role/data
        const user = await req.collections.users.findOne({ _id: new ObjectId(decoded.uid) });

        if (!user) {
            return res.status(401).send({ message: 'Unauthorized: User not found' });
        }

        req.user = user; // Attach REAL user from DB (contains password, so be careful in controllers)
        next();
    } catch (err) {
        return res.status(403).send({ message: 'Forbidden access: Invalid token' });
    }
};

const verifyAdmin = (req, res, next) => {
    // req.user is now the fresh DB document
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send({ message: 'Forbidden access: Admin only' });
    }
};

module.exports = { verifyToken, verifyAdmin };
