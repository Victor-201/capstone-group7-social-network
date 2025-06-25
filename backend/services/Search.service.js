import { Op, Sequelize } from 'sequelize';
import models from '../models/index.js';
import friendService from "./Friend.service.js";

const { UserInfo, UserAccount, Post } = models;

export default {
  async searchUsers(query, user_id) {
    try {
      const lowercaseQuery = query.toLowerCase();
      if (!lowercaseQuery) {
        return { error: null, result: [] };
      }

      const users = await UserInfo.findAll({
        where: {
          [Op.or]: [
            Sequelize.where(
              Sequelize.fn('LOWER', Sequelize.col('UserInfo.full_name')),
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
            as: 'userAccount',
            attributes: ['user_name', 'email', 'phone_number', 'role'],
            required: false
          }
        ],
        attributes: ['id', 'full_name', 'avatar', 'isOnline'],
        limit: 10
      });

      const resultWithMutual = [];

      for (const user of users) {
        if (user.id === user_id) continue;

        const [{ result: mutualData, count = 0 } = {}, { isFriend = false } = {}] = await Promise.all([
          friendService.getMutualFriends(user_id, user.id),
          friendService.isFriend(user_id, user.id)
        ]);

        resultWithMutual.push({
          ...user.toJSON(),
          mutualFriendsCount: count,
          mutualFriends: mutualData?.mutualFriends || [],
          isFriend
        });
      }

      resultWithMutual.sort((a, b) => {
        // sort voi hai phan tu trong mang resultWithMutual
        if (a.isFriend && !b.isFriend) return -1;
        // neu a la ban thi se giua nguyen vi tri trong mang
        if (!a.isFriend && b.isFriend) return 1;
        // neu a false va b true thi se sort lai
        return b.mutualFriendsCount - a.mutualFriendsCount;
        // doi vi tri cua a va b neu ban cua b lon hon a
      });
      
      return { error: null, result: resultWithMutual };

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
