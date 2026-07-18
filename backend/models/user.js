const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message'
    }],
    profilePic: String
});

module.exports = mongoose.model('user', userSchema);