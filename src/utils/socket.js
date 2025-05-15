const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const Conversation = require('../models/Conversation');
const Message = require('../models/Messages');

let io;

const initializeSocket = (server) => {
    const frontURL = process.env.ENV === "production" ? process.env.FRONTEND_URL : process.env.DEV_FRONTEND_URL
    io = socketio(server, {
        cors: {
            origin: frontURL,
            methods: ["GET", "POST"],
            credentials: true
        },
        path: "/socket.io"
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            console.log(token);

            if (!token) return next(new Error('Authentication error'));

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error('Authentication failed'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.id}`);

        // Join user's personal room
        socket.join(socket.user.id);

        // Join existing conversations
        socket.on('join_conversations', async () => {
            const conversations = await Conversation.find({
                $or: [
                    { provider: socket.user.id },
                    { customer: socket.user.id }
                ]
            });

            conversations.forEach(conv => {
                socket.join(conv._id.toString());
            });
        });

        // Handle new messages
        socket.on('send_message', async (data, callback) => {
            try {
                const conversation = await Conversation.findById(data.conversationId);

                // Verify conversation exists and user is participant
                if (!conversation ||
                    (!conversation.provider.equals(socket.user.id) &&
                        !conversation.customer.equals(socket.user.id))) {
                    return callback({ error: 'Invalid conversation' });
                }

                // Enforce provider-first rule
                if (conversation.messages.length === 0 &&
                    !conversation.provider.equals(socket.user.id)) {
                    return callback({ error: 'Only provider can initiate conversation' });
                }

                const receiverId = conversation.provider.equals(socket.user.id)
                    ? conversation.customer
                    : conversation.provider;

                const message = new Message({
                    conversation: conversation._id,
                    sender: socket.user.id,
                    receiver: receiverId,
                    content: data.content
                });

                await message.save();

                // Update conversation
                conversation.lastMessage = message._id;
                conversation.updatedAt = Date.now();
                await conversation.save();

                // Emit to conversation room
                io.to(data.conversationId).emit('receive_message', message);

                // Emit notification to receiver
                io.to(receiverId.toString()).emit('new_message_notification', {
                    conversationId: conversation._id,
                    senderId: socket.user.id,
                    messageId: message._id,
                    preview: data.content.substring(0, 30)
                });

                callback({ success: true, message });
            } catch (err) {
                callback({ error: err.message });
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.id}`);
        });
    });
};

module.exports = { initializeSocket };