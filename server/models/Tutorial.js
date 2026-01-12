const { ObjectId } = require('mongodb');

class Tutorial {
    constructor(collection) {
        this.collection = collection;
    }

    async create(tutorialData) {
        return await this.collection.insertOne({ ...tutorialData, createdAt: new Date() });
    }

    async getAll() {
        return await this.collection.find({}).toArray();
    }

    async delete(id) {
        return await this.collection.deleteOne({ _id: new ObjectId(id) });
    }
}

module.exports = Tutorial;
