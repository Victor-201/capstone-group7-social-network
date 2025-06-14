export const notificationHandler = (io, socket) => {
  socket.on('joinNotification', (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined notification room`);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected from notifications');
  });
}