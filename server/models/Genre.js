const { ObjectId } = require('mongodb');

class Genre {
    constructor(collection) {
        this.collection = collection;
    }

    async create(name) {
        return await this.collection.insertOne({ name, createdAt: new Date() });
    }

    async getAll() {
        return await this.collection.find({}).toArray();
    }

    async update(id, name) {
        return await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { name } }
        );
    }

    async delete(id) {
        return await this.collection.deleteOne({ _id: new ObjectId(id) });
    }
}

module.exports = Genre;
