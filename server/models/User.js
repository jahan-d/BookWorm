const { ObjectId } = require('mongodb');

class User {
    constructor(collection) {
        this.collection = collection;
    }

    async findByEmail(email) {
        return await this.collection.findOne({ email });
    }

    async findById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    async create(userData) {
        // userData must include: name, email, password (hashed), photoURL
        const newUser = {
            name: userData.name,
            email: userData.email,
            password: userData.password, // Expecting hashed password
            role: userData.role || 'user',
            photoURL: userData.photoURL || '',
            shelves: {
                wantToRead: [],      // [{ bookId, addedAt }]
                currentlyReading: [], // [{ bookId, progress, lastUpdated }]
                read: []             // [{ bookId, finishedAt, rating }]
            },
            readingGoal: 0,
            followers: [],
            following: [],
            createdAt: new Date()
        };
        return await this.collection.insertOne(newUser);
    }

    async follow(followerEmail, targetEmail) {
        await this.collection.updateOne(
            { email: followerEmail },
            { $addToSet: { following: targetEmail } }
        );
        return await this.collection.updateOne(
            { email: targetEmail },
            { $addToSet: { followers: followerEmail } }
        );
    }

    async unfollow(followerEmail, targetEmail) {
        await this.collection.updateOne(
            { email: followerEmail },
            { $pull: { following: targetEmail } }
        );
        return await this.collection.updateOne(
            { email: targetEmail },
            { $pull: { followers: followerEmail } }
        );
    }

    async updateRole(id, role) {
        return await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { role } }
        );
    }

    async updateShelf(email, bookId, shelfName) {
        // Spec requires strict shelf moves.
        // 1. Remove from ALL shelves (using $pull with bookId filter inside objects)
        const pullUpdate = {
            $pull: {
                'shelves.wantToRead': { bookId: bookId },
                'shelves.currentlyReading': { bookId: bookId },
                'shelves.read': { bookId: bookId }
            }
        };

        await this.collection.updateOne({ email }, pullUpdate);

        // 2. Add to target shelf with specific metadata
        if (!shelfName) return; // If removing only

        let pushObject;
        const now = new Date();

        if (shelfName === 'wantToRead') {
            pushObject = { bookId, addedAt: now };
        } else if (shelfName === 'currentlyReading') {
            pushObject = { bookId, progress: 0, lastUpdated: now };
        } else if (shelfName === 'read') {
            pushObject = { bookId, finishedAt: now, rating: 0 };
        }

        if (pushObject) {
            return await this.collection.updateOne(
                { email },
                { $push: { [`shelves.${shelfName}`]: pushObject } }
            );
        }
    }

    async updateProgress(email, bookId, pagesRead) {
        return await this.collection.updateOne(
            { email, 'shelves.currentlyReading.bookId': bookId },
            {
                $set: {
                    'shelves.currentlyReading.$.progress': pagesRead,
                    'shelves.currentlyReading.$.lastUpdated': new Date()
                }
            }
        );
    }

    async findAll(searchText = '') {
        const query = searchText ? {
            $or: [
                { name: { $regex: searchText, $options: 'i' } },
                { email: { $regex: searchText, $options: 'i' } }
            ]
        } : {};
        return await this.collection.find(query).toArray();
    }
}

module.exports = User;
