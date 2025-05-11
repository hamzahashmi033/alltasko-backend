const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceRequest',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceProvider',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [
        {
            text: String,
            senderId: String,
            receiverId: String,
            timestamp: String
        }
    ],
    providerInitiated: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

conversationSchema.index({ provider: 1 });
conversationSchema.index({ customer: 1 });
conversationSchema.index({ lead: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);