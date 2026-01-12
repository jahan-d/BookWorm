const { ObjectId } = require('mongodb');

class Activity {
    constructor(collection) {
        this.collection = collection;
    }

    async log(activityData) {
        const activity = {
            ...activityData,
            createdAt: new Date()
        };
        return await this.collection.insertOne(activity);
    }

    async getFeed(followingEmails) {
        return await this.collection.find({
            userEmail: { $in: followingEmails }
        })
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray();
    }
}

module.exports = Activity;
