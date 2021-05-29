const mongoose = require('mongoose');
const User = require('./user');

const reviewSchema = new mongoose.Schema({
    body: {
        type: String,
    },
    rating: Number,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})
module.exports = mongoose.model('Review', reviewSchema);