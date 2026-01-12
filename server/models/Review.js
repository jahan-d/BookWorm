const { ObjectId } = require('mongodb');

class Review {
    constructor(collection) {
        this.collection = collection;
    }

    async create(reviewData) {
        const review = {
            ...reviewData,
            status: 'pending',
            createdAt: new Date()
        };
        return await this.collection.insertOne(review);
    }

    async findByBookId(bookId) {
        return await this.collection.find({ bookId, status: 'approved' }).toArray();
    }

    async findAllPending() {
        return await this.collection.find({ status: 'pending' }).toArray();
    }

    async approve(id) {
        return await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'approved' } }
        );
    }

    async delete(id) {
        return await this.collection.deleteOne({ _id: new ObjectId(id) });
    }
}

module.exports = Review;
