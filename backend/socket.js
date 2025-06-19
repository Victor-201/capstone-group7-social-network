export const notificationHandler = (io, socket) => {
  socket.on('joinNotification', () => {
    const userId = socket.user.id;
    socket.join(userId);
    console.log(`${userId} joined notification room`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected from notifications');
  });
}

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