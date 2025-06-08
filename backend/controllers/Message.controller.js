import models from '../models/index.js';
import { Op } from 'sequelize';

const { Message, Chat, UserInfo } = models;

export const sendMessage = async (req, res) => {
  const { content } = req.body;
  const senderId = req.user.id;
  const chatId = req.params.id;

  if (!chatId || !content) {
    return res.status(400).json({ error: 'Chat ID and content are required.' });
  }

  try {
    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }

    const participant = await models.ChatParticipant.findOne({
      where: {
        chat_id: chatId,
        user_id: senderId
      }
    });

    if (!participant) {
      return res.status(403).json({ error: 'You are not a participant of this chat.' });
    }

    const message = await Message.create({
      chat_id: chatId,
      sender_id: senderId,
      content
    });

    return res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (err) {
    console.error('Error sending message:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const getMessagesByChat = async (req, res) => {
  const chat_id = req.params.chat_id;

  try {
    const messages = await Message.findAll({
      where: { chat_id },
      include: [{
        model: UserInfo,
        as: 'Sender',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['sent_at', 'ASC']]
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};