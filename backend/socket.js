import { handleMessageSocket } from './sockets/messageHandler.js';
import { handleNotificationSocket } from './sockets/notificationHandler.js';
import { socketVerifyToken } from './middleware/authorization.middleware.js';

export const setupSocket = (io) => {
  io.use(socketVerifyToken);
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    // Handle message socket events
    handleMessageSocket(io, socket);
    // Handle notification socket events
    handleNotificationSocket(io, socket);
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}