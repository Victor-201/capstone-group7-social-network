import { registerSocket, removeSocket } from "./services/socket.service.js";

export const notificationHandler = (io, socket) => {
  socket.on('joinNotification', () => {
    const userId = socket.user.id;
    registerSocket(userId, socket);
    console.log(`${userId} joined notification room via direct socket`);
  });
  
  socket.on('disconnect', () => {
    const userId = socket.user?.id;
    if (userId) {
      removeSocket(userId);
      console.log(`${userId} disconnected from notifications`);
    }
  });
};

export const messageHandler = (io, socket) => {
  socket.on('joinChat', (chatId) => {
    if (chatId) {
      socket.join(chatId);
      console.log(`User joined chat room: ${chatId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected from chat');
  });
}