const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }, {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    lastMessage: String,
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('chat', chatSchema);