const { Server } = require('socket.io');
const User = require('../models/User');

let io;

const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('presence:online', async (userId) => {
      if (!userId) return;
      await User.findByIdAndUpdate(userId, { isOnline: true, lastSeenAt: new Date() });
      io.emit('presence:update', { userId, isOnline: true });
    });

    socket.on('room:join', (roomId) => {
      socket.join(roomId);
    });

    socket.on('chat:typing', ({ roomId, userId }) => {
      socket.to(roomId).emit('chat:typing', { userId });
    });

    socket.on('chat:stopTyping', ({ roomId, userId }) => {
      socket.to(roomId).emit('chat:stopTyping', { userId });
    });

    socket.on('disconnecting', async () => {
      const userId = socket.handshake.auth?.userId;
      if (userId) {
        await User.findByIdAndUpdate(userId, { isOnline: false, lastSeenAt: new Date() });
        io.emit('presence:update', { userId, isOnline: false });
      }
    });
  });
};

const getIO = () => io;

module.exports = { setupSocket, getIO };
