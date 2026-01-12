const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
    constructor(models) {
        this.User = models.User;
    }

    // Helper to sanitize user object
    sanitizeUser(user) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            photoURL: user.photoURL,
            shelves: user.shelves,
            readingGoal: user.readingGoal,
            followers: user.followers,
            following: user.following,
            createdAt: user.createdAt
        };
    }

    // POST /auth/register
    async register(req, res) {
        try {
            let { name, email, password, photoURL } = req.body;
            email = email.toLowerCase(); // SEO/Best Practice: Normalize email

            // 1. Check if email exists
            const existingUser = await this.User.findByEmail(email);
            if (existingUser) {
                return res.status(400).send({ message: 'User already exists' });
            }

            // 2. Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // 3. Create user
            const result = await this.User.create({
                name,
                email,
                password: hashedPassword,
                photoURL,
                role: 'user' // Force user role
            });

            // 4. Create JWT
            // Note: DB ID is in result.insertedId
            const token = jwt.sign(
                { uid: result.insertedId, email: email, role: 'user' },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Fetch created user to return, sanitized
            const newUser = await this.User.findById(result.insertedId);
            res.status(201).send({ token, user: this.sanitizeUser(newUser) });

        } catch (error) {
            console.error('Register Error:', error);
            res.status(500).send({ message: 'Error registering user', error: error.message });
        }
    }

    // POST /auth/login
    async login(req, res) {
        try {
            let { email, password } = req.body;
            email = email.toLowerCase();

            // 1. Find user
            const user = await this.User.findByEmail(email);
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            // 2. Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).send({ message: 'Invalid credentials' });
            }

            // 3. Generate JWT
            const token = jwt.sign(
                { uid: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Return token and sanitized user
            res.send({ token, user: this.sanitizeUser(user) });

        } catch (error) {
            console.error('Login Error:', error);
            res.status(500).send({ message: 'Error logging in', error: error.message });
        }
    }

    // GET /auth/me
    async me(req, res) {
        try {
            // req.user is set by verifyToken middleware (from DB)
            // It contains the full document including password, so we MUST sanitize.
            if (!req.user) {
                return res.status(404).send({ message: 'User not found in session' });
            }
            res.send(this.sanitizeUser(req.user));
        } catch (error) {
            res.status(500).send({ message: 'Error fetching profile' });
        }
    }
}
module.exports = AuthController;
