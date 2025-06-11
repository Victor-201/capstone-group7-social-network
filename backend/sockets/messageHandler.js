import { createMessage } from '../services/createMessage.service.js';

export const handleMessageSocket = (io, socket) => {
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
  });

  socket.on('sendMessage', async (data) => {
    const { chatId, content } = data;
    const senderId = socket.user?.id;
    console.log('Socket sendMessage data:', data);

    try {
      const message = await createMessage({ chatId, senderId, content });

      socket.to(chatId).emit('receiveMessage', {
        id: message.id,
        chatId: message.chat_id,
        senderId: message.sender_id,
        message: message.content,
        timestamp: message.sent_at,
      });
    } catch (err) {
      console.error('Socket sendMessage error:', err);
      socket.emit('errorMessage', { error: err.message });
    }
  });
};
