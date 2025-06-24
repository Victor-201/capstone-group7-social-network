import models from '../models/index.js';
const { Follow } = models;

export default {
  async followUser(follower_id, following_id) {
    try {
      if (follower_id === following_id) {
        return { error: { code: 400, message: "You can't follow yourself" } };
      }

      const follow = await Follow.create({ follower_id, following_id });
      return { result: follow };
    } catch (error) {
      console.error('Error following user:', error);
      return {
        error: { code: 500, message: 'Internal server error', detail: error.message }
      };
    }
  },

  async unfollowUser(follower_id, following_id) {
    try {
      const deleted = await Follow.destroy({
        where: { follower_id, following_id }
      });

      if (!deleted) {
        return {
          error: { code: 404, message: 'Follow relationship not found' }
        };
      }

      return { result: { message: 'Unfollowed successfully' } };
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return {
        error: { code: 500, message: 'Internal server error', detail: error.message }
      };
    }
  },

  async getFollowers(user_id) {
    try {
      const { UserInfo } = models;
      const followers = await Follow.findAll({
        where: { following_id: user_id },
        include: [{
          model: UserInfo,
          as: 'Follower',
          attributes: ['id', 'full_name', 'avatar']
        }]
      });

      return { 
        result: { 
          data: followers.map(f => f.Follower),
          count: followers.length 
        } 
      };
    } catch (error) {
      console.error('Error getting followers:', error);
      return {
        error: { code: 500, message: 'Internal server error', detail: error.message }
      };
    }
  },

  async getFollowing(user_id) {
    try {
      const { UserInfo } = models;
      const following = await Follow.findAll({
        where: { follower_id: user_id },
        include: [{
          model: UserInfo,
          as: 'Following',
          attributes: ['id', 'full_name', 'avatar']
        }]
      });

      return { 
        result: { 
          data: following.map(f => f.Following),
          count: following.length 
        } 
      };
    } catch (error) {
      console.error('Error getting following:', error);
      return {
        error: { code: 500, message: 'Internal server error', detail: error.message }
      };
    }
  },

  async getFollowStatus(follower_id, following_id) {
    try {
      const follow = await Follow.findOne({
        where: { follower_id, following_id }
      });

      return { 
        result: { 
          status: follow ? 'following' : 'not_following',
          isFollowing: !!follow
        } 
      };
    } catch (error) {
      console.error('Error getting follow status:', error);
      return {
        error: { code: 500, message: 'Internal server error', detail: error.message }
      };
    }
  },
};
