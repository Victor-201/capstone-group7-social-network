import models from '../models/index.js';
import { Op, Sequelize } from 'sequelize';

const { Chat, ChatParticipant } = models;

export default {
  async createPrivateChat(userId, otherUserId) {
    if (userId.toString() === otherUserId.toString()) {
      return {
        error: { code: 400, message: 'You cannot create a chat with yourself.' }
      };
    }

    try {
      const existingChat = await Chat.findOne({
        where: { is_group: false },
        include: [{
          model: ChatParticipant,
          as: 'Participants',
          where: {
            user_id: { [Op.in]: [userId, otherUserId] }
          },
          attributes: ['user_id']
        }],
        group: ['Chat.id'],
        having: Sequelize.literal('COUNT(*) = 2')
      });

      if (existingChat) {
        return { result: { message: "Chat already exists", chatId: existingChat.id } };
      }

      const chat = await Chat.create({ is_group: false });

      await ChatParticipant.bulkCreate([
        { chat_id: chat.id, user_id: userId },
        { chat_id: chat.id, user_id: otherUserId }
      ]);

      return { result: { message: 'Private chat created', chat } };
    } catch (error) {
      return {
        error: { code: 500, message: 'Error creating chat', detail: error.message }
      };
    }
  },

  async getPrivateChats(userId) {
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

      return { result: chats };
    } catch (error) {
      return {
        error: { code: 500, message: 'Error fetching chat list', detail: error.message }
      };
    }
  }
};
