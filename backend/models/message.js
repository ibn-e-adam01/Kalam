const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
   message: String,
   sentAt: {
    type: Date,
    default: Date.now
   }
});

module.exports = mongoose.model('message', messageSchema);