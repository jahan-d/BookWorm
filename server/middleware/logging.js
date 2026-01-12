const logActivity = async (activityCollection, userId, action, details) => {
    const log = {
        userId,
        action,
        details,
        createdAt: new Date()
    }
    const result = await activityCollection.insertOne(log);
    return result;
}

module.exports = { logActivity };
