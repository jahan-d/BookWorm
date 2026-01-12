const { ObjectId } = require('mongodb');

class Book {
    constructor(collection) {
        this.collection = collection;
    }

    async create(bookData) {
        const newBook = {
            ...bookData,
            ratings: [],
            averageRating: 0,
            totalRatings: 0,
            createdAt: new Date()
        };
        return await this.collection.insertOne(newBook);
    }

    async findAll(filters = {}) {
        const { search, genre, rating, sortBy, limit = 20, skip = 0 } = filters;
        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }

        if (genre) {
            // genre can be a string or array (multi-select)
            query.genre = Array.isArray(genre) ? { $in: genre } : genre;
        }

        if (rating) {
            query.averageRating = { $gte: parseFloat(rating) };
        }

        let sort = { createdAt: -1 };
        if (sortBy === 'rating') sort = { averageRating: -1 };
        if (sortBy === 'mostShelved') sort = { totalShelved: -1 }; // Placeholder for field

        return await this.collection.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .toArray();
    }

    async findById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    async update(id, updateData) {
        return await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
    }

    async delete(id) {
        return await this.collection.deleteOne({ _id: new ObjectId(id) });
    }

    async updateRating(bookId, userId, rating) {
        const book = await this.findById(bookId);
        if (!book) throw new Error('Book not found');

        // Remove old rating by this user if exists
        const filteredRatings = (book.ratings || []).filter(r => r.userId !== userId);
        filteredRatings.push({ userId, rating, date: new Date() });

        const total = filteredRatings.reduce((sum, r) => sum + r.rating, 0);
        const avg = total / filteredRatings.length;

        return await this.collection.updateOne(
            { _id: new ObjectId(bookId) },
            {
                $set: {
                    ratings: filteredRatings,
                    averageRating: avg,
                    totalRatings: filteredRatings.length
                }
            }
        );
    }
}

module.exports = Book;
