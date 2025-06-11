import models from '../models/index.js';

const { Message, Chat, ChatParticipant } = models;

export const createMessage = async ({ chatId, senderId, content }) => {
  if (!chatId || !content || !senderId) {
    throw new Error('Missing parameters');
  }

  const chat = await Chat.findByPk(chatId);
  if (!chat) {
    throw new Error('Chat not found');
  }

  const participant = await ChatParticipant.findOne({
    where: { chat_id: chatId, user_id: senderId }
  });

  if (!participant) {
    throw new Error('You are not a participant of this chat');
  }

  const message = await Message.create({
    chat_id: chatId,
    sender_id: senderId,
    content,
  });

  return message;
};
