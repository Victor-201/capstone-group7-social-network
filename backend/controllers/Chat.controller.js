import models from '../models/index.js';
import { Op, Sequelize } from 'sequelize';

const { Chat, ChatParticipant } = models;
export const createChat = async (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;

  if (userId.toString() === id.toString()) {
    return res.status(400).json({ error: 'You cannot create a chat with yourself.' });
  }

  try {
    const existingChat = await Chat.findOne({
      where: { is_group: false },
      include: [{
        model: ChatParticipant,
        as: 'Participants',
        where: {
          user_id: { [Op.in]: [userId, id] }
        },
        attributes: ['user_id']
      }],
      group: ['Chat.id'],
      having: Sequelize.literal('COUNT(*) = 2')
    });

    if (existingChat) {
      return res.status(200).json({ message: "Chat already exists", chatId: existingChat.id });
    }

    const chat = await Chat.create({ is_group: false });

    await ChatParticipant.bulkCreate([
      { chat_id: chat.id, user_id: userId },
      { chat_id: chat.id, user_id: id }
    ]);

    return res.status(201).json({
      message: 'Private chat created',
      chat
    });

  } catch (err) {
    console.error('Error creating chat:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getChatList = async (req, res) => {
  const userId = req.user.id;

  try {
    const chats = await Chat.findAll({
      where: { is_group: false },
      include: [{
        model: ChatParticipant,
        as: 'Participants',
        where: { user_id: userId },
        attributes: []
      }],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json(chats);
  } catch (err) {
    console.error('Error fetching chat list:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}