import models from '../models/index.js';
const { Comment, Post } = models;

export default {
  async createComment(post_id, user_id, content) {
    if (!post_id || !user_id || !content) {
      return { error: { code: 400, message: 'Missing required fields: post_id, user_id, content' } };
    }

    try {
      const comment = await Comment.create({ post_id, user_id, content });

      const post = await Post.findByPk(post_id);
      if (!post) {
        return { error: { code: 404, message: 'Post not found' } };
      }

      const receiver_id = post.user_id;

      return {
        result: {
          comment,
          receiver_id
        }
      };
    } catch (error) {
      console.error('Error creating comment:', error);
      return { error: { code: 500, message: 'Internal server error' } };
    }
  },

  async replyToComment(parent_comment_id, user_id, content) {
    if (!parent_comment_id || !user_id || !content) {
      return { error: { code: 400, message: 'Missing required fields: parent_comment_id, user_id, content' } };
    }

    try {
      const parentComment = await Comment.findOne({ where: { id: parent_comment_id } });

      if (!parentComment) {
        return { error: { code: 404, message: 'Parent comment not found' } };
      }

      const reply = await Comment.create({
        post_id: parentComment.post_id,
        user_id,
        content,
        parent_comment_id: parent_comment_id
      });

      return {
        result: {
          message: 'Reply created successfully',
          reply
        }
      };
    } catch (error) {
      console.error('Error replying to comment:', error);
      return { error: { code: 500, message: 'Internal server error' } };
    }
  },

  async deleteComment(comment_id, user_id) {
    try {
      const comment = await Comment.findOne({ where: { id: comment_id, user_id } });

      if (!comment) {
        return { error: { code: 404, message: 'Comment not found or no permission to delete' } };
      }

      await comment.destroy();

      return {
        result: {
          message: 'Comment deleted successfully'
        }
      };
    } catch (error) {
      console.error('Error deleting comment:', error);
      return { error: { code: 500, message: 'Internal server error' } };
    }
  }
};
