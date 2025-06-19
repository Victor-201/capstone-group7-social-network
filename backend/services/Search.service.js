import { Op, Sequelize } from 'sequelize';
import models from '../models/index.js';

const { UserInfo, UserAccount, Post } = models;

export default {
  async searchUsers(query) {
    try {
      const lowercaseQuery = query.toLowerCase();

      const users = await UserInfo.findAll({
        where: {
          [Op.or]: [
            Sequelize.where(
              Sequelize.fn('LOWER', Sequelize.col('UserInfo.full_name')),
              { [Op.like]: `%${lowercaseQuery}%` }
            ),
            Sequelize.where(
              Sequelize.fn('LOWER', Sequelize.col('UserInfo.id')),
              { [Op.like]: `%${lowercaseQuery}%` }
            ),
            Sequelize.where(
              Sequelize.fn('LOWER', Sequelize.col('UserAccount.user_name')),
              { [Op.like]: `%${lowercaseQuery}%` }
            )
          ]
        },
        include: [
          {
            model: UserAccount,
            attributes: ['user_name', 'email', 'phone_number', 'role'],
            required: false
          }
        ],
        attributes: ['id', 'full_name', 'avatar', 'isOnline'],
        limit: 10
      });

      return { error: null, result: users };
    } catch (error) {
      console.error('Search user error:', error);
      return {
        error: {
          code: 500,
          message: 'Internal Server Error',
          detail: error.message
        },
        result: null
      };
    }
  },

  async searchPosts(query) {
    try {
      const posts = await Post.findAll({
        where: {
          content: {
            [Op.like]: `%${query}%`
          }
        },
        include: [
          {
            model: UserInfo,
            attributes: ['id', 'full_name', 'avatar']
          }
        ],
        order: [['created_at', 'DESC']],
        limit: 20
      });

      return { error: null, result: posts };
    } catch (error) {
      console.error('Search post error:', error);
      return {
        error: {
          code: 500,
          message: 'Failed to search posts',
          detail: error.message
        },
        result: null
      };
    }
  }
};
