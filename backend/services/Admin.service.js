import models from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../configs/database.config.js';

const { UserInfo, UserAccount, Post, Like, Comment } = models;

export default {
  async getAllUsers({ page = 1, limit = 10 }) {
    try {
      const offset = (page - 1) * limit;

      // Get users with a simpler query to avoid potential errors
      const users = await UserAccount.findAll({
        offset,
        limit,
        order: [['created_at', 'DESC']],
        attributes: [
          'id',
          'email',
          'user_name',
          'phone_number',
          'role',
          'status',
          'created_at'
        ]
      });

      // Get the UserInfo data separately for each user
      if (users && users.length > 0) {
        const userIds = users.map(user => user.id);
        
        const userInfos = await UserInfo.findAll({
          where: { id: userIds },
          attributes: ['id', 'full_name', 'avatar', 'isOnline']
        });
        
        // Create a map of user_id to userInfo
        const userInfoMap = {};
        userInfos.forEach(info => {
          userInfoMap[info.id] = info;
        });
        
        // Attach userInfo to each user
        users.forEach(user => {
          user.dataValues.userInfo = userInfoMap[user.id] || null;
        });
      }

      const count = await UserAccount.count();

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
      console.error("Error fetching admin users:", error);
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

      // First get the posts without the complex query
      const { count, rows: posts } = await models.Post.findAndCountAll({
        offset,
        limit,
        order: [['created_at', 'DESC']],
        attributes: [
          'id', 
          'content', 
          'created_at',
          'like_count'
        ],
        include: [
          {
            model: UserInfo,
            attributes: ['full_name', 'avatar'],
          },
        ],
      });

      // Then, for each post, count its comments separately
      if (posts && posts.length > 0) {
        const postIds = posts.map(post => post.id);
        
        const commentCounts = await models.Comment.findAll({
          attributes: [
            'post_id',
            [models.sequelize.fn('COUNT', models.sequelize.col('id')), 'count']
          ],
          where: {
            post_id: postIds
          },
          group: ['post_id']
        });
        
        // Create a map of post_id to comment count
        const commentCountMap = {};
        commentCounts.forEach(comment => {
          commentCountMap[comment.post_id] = comment.get('count');
        });
        
        // Add comment_count to each post
        posts.forEach(post => {
          post.dataValues.comment_count = commentCountMap[post.id] || 0;
        });
      }

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
      console.error("Error fetching admin posts:", error);
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
