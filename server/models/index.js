const User = require('./User');
const Book = require('./Book');
const Genre = require('./Genre');
const Review = require('./Review');
const Tutorial = require('./Tutorial');
const Activity = require('./Activity');

function initializeModels(collections) {
    return {
        User: new User(collections.users),
        Book: new Book(collections.books),
        Genre: new Genre(collections.genres),
        Review: new Review(collections.reviews),
        Tutorial: new Tutorial(collections.tutorials),
        Activity: new Activity(collections.activities)
    };
}

module.exports = { initializeModels };
