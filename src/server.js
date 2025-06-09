const app = require("./app");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require('socket.io');
const Conversations = require("./models/Conversation");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/alltasko";

const server = http.createServer(app);
const frontURL = process.env.ENV === "production" ? process.env.FRONTEND_URL : process.env.DEV_FRONTEND_URL
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    const io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {

      // Join conversation
      socket.on('join_conversation', async ({ conversationId, userId, providerId }) => {
        try {
          const conversation = await Conversations.findById(conversationId);

          if (!conversation) {
            return socket.emit('error', { message: 'Conversation not found' });
          }

          const isParticipant = conversation.user.equals(userId) || conversation.provider.equals(providerId);

          if (!isParticipant) {
            return socket.emit('error', { message: 'Not in conversation' });
          }

          socket.join(conversationId);
          socket.emit('conversation_history', conversation.messages);

          // Store minimal data needed
          socket.data = {
            conversationId,
            isProvider: conversation.provider.equals(providerId),
            userId: conversation.user.equals(userId) ? userId : null,
            providerId: conversation.provider.equals(providerId) ? providerId : null
          };

        } catch (err) {
          console.error('Join error:', err);
          socket.emit('error', { message: 'Error joining' });
        }
      });

      // Send message
      socket.on('send_private_message', async ({ text }, callback) => {
        try {
          if (!socket.data?.conversationId) return;

          const newMessage = {
            text,
            senderId: socket.data.isProvider ? socket.data.providerId : socket.data.userId,
            receiverId: socket.data.isProvider ? socket.data.userId : socket.data.providerId,
            timestamp: new Date()
          };

          // Save to database
          await Conversations.updateOne(
            { _id: socket.data.conversationId },
            { $push: { messages: newMessage } }
          );

          // Acknowledge the message was sent (only to sender)
          callback({ status: 'success', message: newMessage });

          // Broadcast to other participants in the room (excluding sender)
          socket.to(socket.data.conversationId).emit('receive_private_message', newMessage);

        } catch (err) {
          console.error('Message error:', err);
          callback({ status: 'error', message: 'Failed to send message' });
        }
      });

    });

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);

    });
  })
  .catch(err => console.error("❌ MongoDB error:", err));