import models from '../models/index.js';
import { Op, Sequelize } from 'sequelize';

const { Chat, ChatParticipant, UserAccount, UserInfo, Message } = models;

export default {
  async createPrivateChat(userId, otherUserId) {
    if (!otherUserId) {
      throw new Error('Thiếu userId hoặc otherUserId để tạo chat', userId, otherUserId);
    }
    if (userId.toString() === otherUserId.toString()) {
      return {
        error: { code: 400, message: 'You cannot create a chat with yourself.' }
      };
    }

    try {
      const existingChat = await ChatParticipant.findAll({
        where: {
          user_id: { [Op.in]: [userId, otherUserId] }
        },
        attributes: ['chat_id'],
        group: ['chat_id'],
        having: Sequelize.literal('COUNT(DISTINCT user_id) = 2'),
        include: [{
          model: Chat,
          where: { is_group: false },
          attributes: []
        }]
      });
      if (existingChat.length > 0) {
        const chat_id = existingChat[0].chat_id;
        return { result: { message: 'Private chat already exists', chat_id } };
      }

      const chat = await Chat.create({ is_group: false });
      await ChatParticipant.bulkCreate([
        { chat_id: chat.id, user_id: userId },
        { chat_id: chat.id, user_id: otherUserId }
      ]);

      const chat_id = chat.id
      return { result: { message: 'Private chat created', chat_id } };
    } catch (error) {
      return {
        error: { code: 500, message: 'Error creating chat', detail: error.message }
      };
    }
  },

  async getPrivateChats(userId) {
    try {
      const chats = await Chat.findAll({
        where: {
          is_group: false,
          '$Participants.user_id$': userId,
        },
       
        include: [
          {
            model: ChatParticipant,
            as: 'Participants',
            required: true,
            required: true,
            attributes: ['user_id'],
            include: [
              {
                model: UserInfo,
                as: 'User',
                attributes: ['id', 'full_name', 'avatar'],
                include: [
                  {
                    model: UserAccount,
                    as: 'userAccount',
                    attributes: ['user_name']
                  }
                ]
              }
            ]
          },
          {
            model: Message,
            as: 'Messages',
            separate: true,
            limit: 1,
            order: [['sent_at', 'DESC']]
          }
        ],
        order: [['created_at', 'DESC']],
        subQuery: false 
      });

      const result = await Promise.all(chats.map(async (chat) => {
        const otherParticipant = await ChatParticipant.findOne({
          where: {
            chat_id: chat.id,
            user_id: { [Op.ne]: userId }
          },
          include: [{
            model: UserInfo,
            as: 'User',
            attributes: ['id', 'full_name', 'avatar'],
            include: [{
              model: UserAccount,
              as: 'userAccount',
              attributes: ['user_name']
            }]
          }]
        });

        return {
          chat_id: chat.id,
          latest_message: chat.Messages?.[0] || null,
          other_user: otherParticipant?.User || null
        };
      }));
      return { result };
    } catch (error) {
      console.error('Get private chats error:', error);
      return {
        error: {
          code: 500,
          message: 'Error fetching private chats',
          detail: error.message
        }
      };
    }
  }
};
