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
  }
};
