import models from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../configs/database.config.js';

const { UserInfo, UserAccount, Post, Like, Comment } = models;

export default {
  async getAllUsers({ page = 1, limit = 10 }) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows: users } = await UserInfo.findAndCountAll({
        offset,
        limit,
        order: [['full_name', 'ASC']],
        attributes: ['id', 'full_name', 'avatar', 'isOnline'],
        include: [
          {
            model: UserAccount,
            attributes: [
              'email',
              'user_name',
              'phone_number',
              'role',
              'status',
              'created_at',
            ],
          },
        ],
      });

      return {
        result: {
          message: 'Fetched users successfully',
          users,
          total: count,
          currentPage: page,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      return {
        error: {
          code: 500,
          message: 'Error fetching users',
          detail: error.message,
        },
      };
    }
  },

  async changeUserStatus(userId, status) {
    if (!userId || !['active', 'suspended', 'deleted'].includes(status)) {
      return {
        error: { code: 400, message: 'Invalid user ID or status value' },
      };
    }

    try {
      const user = await UserAccount.findByPk(userId);
      if (!user) {
        return { error: { code: 404, message: 'User not found' } };
      }

      user.status = status;
      user.status_update_at = new Date();
      await user.save();

      return {
        result: {
          message: 'User status updated successfully',
          userId,
          status,
        },
      };
    } catch (error) {
      return {
        error: {
          code: 500,
          message: 'Error updating user status',
          detail: error.message,
        },
      };
    }
  },
  async getAllPosts({ page = 1, limit = 10 }) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows: posts } = await models.Post.findAndCountAll({
        offset,
        limit,
        order: [['created_at', 'DESC']],
        attributes: ['id', 'content', 'created_at'],
        include: [
          {
            model: UserInfo,
            attributes: ['full_name', 'avatar'],
          },
        ],
      });

      return {
        result: {
          message: 'Fetched posts successfully',
          posts,
          total: count,
          currentPage: page,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      return {
        error: {
          code: 500,
          message: 'Error fetching posts',
          detail: error.message,
        },
      };
    }
  },
  async deletePost(postId) {
    if (!postId) {
      return {
        error: { code: 400, message: 'Invalid post ID' },
      };
    }

    try {
      const post = await models.Post.findByPk(postId);
      if (!post) {
        return { error: { code: 404, message: 'Post not found' } };
      }

      await post.destroy();

      return {
        result: {
          message: 'Post deleted successfully',
          postId,
        },
      };
    } catch (error) {
      return {
        error: {
          code: 500,
          message: 'Error deleting post',
          detail: error.message,
        },
      };
    }
  },
  async getSystemStats() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));

    const [total_users, new_users_today, total_posts, new_posts_today, total_likes, total_comments] = await Promise.all([
      UserAccount.count(),
      UserAccount.count({ where: { created_at: { [Op.gte]: startOfDay } } }),
      Post.count(),
      Post.count({ where: { created_at: { [Op.gte]: startOfDay } } }),
      Like.count({ where: { created_at: { [Op.gte]: startOfDay } } }),
      Comment.count({ where: { created_at: { [Op.gte]: startOfDay } } }),
    ]);

    const genderCount = await UserInfo.findAll({
      attributes: ['gender', [models.sequelize.fn('COUNT', models.sequelize.col('gender')), 'count']],
      group: ['gender']
    });

    return {
      result: {
        total_users,
        new_users_today,
        total_posts,
        new_posts_today,
        total_likes_today: total_likes,
        total_comments_today: total_comments,
        gender_distribution: genderCount
      }
    };
  }
};
