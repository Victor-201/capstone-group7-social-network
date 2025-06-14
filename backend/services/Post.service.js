import models from '../models/index.js';
import { uploadMultipleMedia } from '../helpers/multer.helper.js';

const { Post, PostMedia } = models;

export default {
  async createPost(user_id, body, files) {
    try {
      const content = body.content || '';
      const accessModifier = body.accessModifier || 'public';

      const mediaResults = uploadMultipleMedia(Array.isArray(files) ? files : []);
      const post = await Post.create({ content, user_id, access_modifier: accessModifier });

      if (mediaResults.length > 0) {
        const mediaRecords = mediaResults.map((file) => ({
          post_id: post.id,
          media_url: file.public_id,
          media_type: file.media_type || null,
        }));
        await PostMedia.bulkCreate(mediaRecords);
      }

      return { result: { message: 'Post created successfully', post } };
    } catch (error) {
      return { error: { code: 500, message: 'Error creating post', detail: error.message } };
    }
  },

  async getPosts(user_id) {
    try {
      const posts = await Post.findAll({
        where: { user_id },
        include: [{ model: PostMedia, as: 'media', attributes: ['media_url', 'media_type'] }],
        order: [['created_at', 'DESC']],
      });
      return { result: posts };
    } catch (error) {
      return { error: { code: 500, message: 'Error fetching posts', detail: error.message } };
    }
  },

  async getPostDetail(postId) {
    try {
      const post = await Post.findOne({
        where: { id: postId },
        include: [{ model: PostMedia, as: 'media', attributes: ['media_url', 'media_type'] }],
      });
      if (!post) return { error: { code: 404, message: 'Post not found' } };
      return { result: post };
    } catch (error) {
      return { error: { code: 500, message: 'Error fetching post detail', detail: error.message } };
    }
  },

  async editPost(user_id, postId, body) {
    try {
      const post = await Post.findOne({ where: { id: postId, user_id } });
      if (!post) return { error: { code: 404, message: 'Post not found or no permission' } };

      post.content = body.content || post.content;
      post.access_modifier = body.accessModifier || post.access_modifier;
      await post.save();

      return { result: { message: 'Post updated successfully', post } };
    } catch (error) {
      return { error: { code: 500, message: 'Error updating post', detail: error.message } };
    }
  },

  async deletePost(user_id, postId) {
    try {
      const post = await Post.findOne({ where: { id: postId, user_id } });
      if (!post) return { error: { code: 404, message: 'Post not found or no permission' } };

      await post.destroy();
      return { result: { message: 'Post deleted successfully' } };
    } catch (error) {
      return { error: { code: 500, message: 'Error deleting post', detail: error.message } };
    }
  },

  async sharePost(user_id, postId) {
    try {
      const originalPost = await Post.findOne({ where: { id: postId } });
      if (!originalPost) return { error: { code: 404, message: 'Original post not found' } };

      const sharedPost = await Post.create({
        content: originalPost.content,
        user_id,
        access_modifier: originalPost.access_modifier,
        shared_post_id: originalPost.shared_post_id || originalPost.id,
      });

      return { result: { message: 'Post shared successfully', post: sharedPost } };
    } catch (error) {
      return { error: { code: 500, message: 'Error sharing post', detail: error.message } };
    }
  },
};
