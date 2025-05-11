const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  
  // Sender can be EITHER a ServiceProvider or User (customer)
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderType' // Dynamic reference
  },
  senderType: {
    type: String,
    required: true,
    enum: ['User', 'ServiceProvider'] // Must match model names
  },

  // Receiver can be EITHER a ServiceProvider or User (customer)
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverType'
  },
  receiverType: {
    type: String,
    required: true,
    enum: ['User', 'ServiceProvider']
  },

  content: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Indexes for performance
messageSchema.index({ conversation: 1 });
messageSchema.index({ sender: 1, senderType: 1 });
messageSchema.index({ receiver: 1, receiverType: 1 });

module.exports = mongoose.model('Message', messageSchema);