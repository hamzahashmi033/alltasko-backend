const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth');
const { verifyProviderToken, verifyToken } = require("../middlewares/verifyTokens")
const Conversation = require('../models/Conversation');
// Create new conversation (provider only)
router.post('/', verifyProviderToken, async (req, res) => {
    try {


        const existing = await Conversation.findOne({
            lead: req.body.leadId,
            provider: req.provider._id
        });

        if (existing) {
            return res.status(400).json({ error: 'Conversation already exists' });
        }

        const conversation = new Conversation({
            lead: req.body.leadId,
            provider: req.provider._id,
            user: req.body.customerId,
            providerInitiated: true
        });

        await conversation.save();
        res.status(201).json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Middleware: authProvider (validates JWT + checks if user is a provider)
router.get('/provider/conversations', verifyProviderToken, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            provider: req.provider._id // Only conversations where they're the provider
        })
            .populate('user', 'name')
            .populate('lead', 'serviceTypeSubSubCategory')
            .sort('-updatedAt');

        res.json(conversations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Middleware: authUser (validates JWT + checks if user is a customer)
router.get('/user/conversations', verifyToken, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            user: req.user._id 
        })
            .populate('provider', 'name')
            .populate('lead', 'serviceTypeSubSubCategory')
            .sort('-updatedAt');
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;