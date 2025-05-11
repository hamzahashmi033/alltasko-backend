const express = require('express');
const router = express.Router();
const { verifyProviderToken, verifyToken } = require("../middlewares/verifyTokens")
const Message = require('../models/Messages');
const Conversation = require('../models/Conversation');

// For providers
router.get('/provider/:conversationId', verifyProviderToken, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      provider: req.provider._id // Only check provider
    });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await Message.find({
      conversation: req.params.conversationId
    }).sort('createdAt');

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// For users
router.get('/user/:conversationId', verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      customer: req.user._id // Only check customer
    });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await Message.find({
      conversation: req.params.conversationId
    }).sort('createdAt');

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;