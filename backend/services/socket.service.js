// socketService.js
const userSockets = new Map();

// Khi user join
export const registerSocket = (userId, socket) => {
  userSockets.set(userId, socket);
};

export const removeSocket = (userId) => {
  userSockets.delete(userId);
};

export const sendNotificationToUser = (userId, event, payload) => {
  const userSocket = userSockets.get(userId);
  if (userSocket) {
    userSocket.emit(event, payload);
    console.log(`Sent ${event} to user ${userId}`);
    return true;
  } else {
    console.warn(`User ${userId} is not connected`);
    return false;
  }
};
