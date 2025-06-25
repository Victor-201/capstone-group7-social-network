import models from '../models/index.js';
import { uploadMultipleMedia } from '../helpers/multer.helper.js';
import friendService from './Friend.service.js';

const { Post, PostMedia, Friend, Like, Follow } = models;

export default {
  async createPost(user_id, body, files) {
    try {
      const content = body.content || '';
      const accessModifier = body.accessModifier || 'public';

      const mediaResults = uploadMultipleMedia(Array.isArray(files) ? files : []);

      const post = await Post.create({
        content,
        user_id,
        access_modifier: accessModifier
      });

      if (mediaResults.length > 0) {
        const mediaRecords = mediaResults.map((file) => ({
          post_id: post.id,
          media_url: file.public_id,
          media_type: file.media_type || null
        }));
        await PostMedia.bulkCreate(mediaRecords);
      }

      const { result: friends } = await friendService.getFriendsList(user_id);
      const friendIds = friends?.map(friend => friend.id) || [];

      return {
        result: {
          message: 'Post created successfully',
          post,
          notifi: {
            action_id: post.id,
            receiver_ids: friendIds,
            action_type: 'post',
            content: 'shared a new post'
          }
        }
      };
    } catch (error) {
      return {
        error: {
          code: 500,
          message: 'Error creating post',
          detail: error.message
        }
      };
    }
  },

  async getPosts(user_id) {
    try {
      const posts = await Post.findAll({
        where: { user_id },
        include: [
          {
            model: PostMedia,
            as: 'media',
            attributes: ['media_url', 'media_type']
          }
        ],
        order: [['created_at', 'DESC']],
      });

      if (posts.length === 0) {
        return { result: [] };
      }
      const postIds = posts.map(post => post.id);

      const likedRecords = await Like.findAll({
        where: {
          user_id,
          post_id: postIds
        },
        attributes: ['post_id']
      });
      const likedPostIds = new Set(likedRecords.map(l => l.post_id));

      const result = posts.map(post => {
        return {
          ...post.toJSON(),
          isLiked: likedPostIds.has(post.id)
        };
      });

      return { result };
    } catch (error) {
      return { error: { code: 500, message: 'Error fetching posts', detail: error.message } };
    }
  },
  async getPostDetail(user_id, postId) {
    try {
      const post = await Post.findOne({
        where: { id: postId },
        include: [{ model: PostMedia, as: 'media', attributes: ['media_url', 'media_type'] }],
      });
      if (!post) return { error: { code: 404, message: 'Post not found' } };
      const likePost = await Like.findOne({ where: { post_id: postId, user_id } });
      var isLiked = false;
      if (likePost) {
        isLiked = true;
      }
      return { result: { post, isLiked } };
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
  async getRelatedPosts(user_id, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const [friends, follows] = await Promise.all([
        friendService.getFriendsList(user_id),
        Follow.findAll({ where: { follower_id: user_id }, attributes: ['following_id'] })
      ]);

      const friendIds = friends.result.friends.map(friend => friend.id);
      const followedIds = follows.map(f => f.following_id);

      const relatedIds = [...new Set([user_id, ...friendIds, ...followedIds])];

      if (relatedIds.length === 0) {
        return { result: [], total: 0, page, limit };
      }

      const [posts, total] = await Promise.all([
        Post.findAll({
          where: {
            user_id: relatedIds,
            access_modifier: 'public'
          },
          include: [
            { model: PostMedia, as: 'media', attributes: ['media_url', 'media_type'] }
          ],
          order: [['created_at', 'DESC']],
          limit,
          offset
        }),
        Post.count({
          where: {
            user_id: relatedIds,
            access_modifier: 'public'
          }
        })
      ]);

      const postIds = posts.map(p => p.id);
      const likedPosts = await Like.findAll({
        where: { user_id, post_id: postIds },
        attributes: ['post_id']
      });
      const likedPostIds = new Set(likedPosts.map(lp => lp.post_id));

      const postsWithLikes = posts.map(post => {
        const postData = post.toJSON();
        postData.isLiked = likedPostIds.has(post.id);
        return postData;
      });

      return {
        result: postsWithLikes,
        total,
        page,
        limit
      };
    } catch (error) {
      return { error: { code: 500, message: 'Error fetching related posts', detail: error.message } };
    }
  }
};
