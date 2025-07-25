import { Op } from "sequelize";
import models from "../models/index.js";

const { Like, Post } = models;

export default {
    async likePost(user_id, post_id) {
        try {
            const existing = await models.Like.findOne({ where: { user_id, post_id } });
            if (existing) {
                return { error: { code: 400, message: "Already liked" } };
            }

            await models.Like.create({ user_id, post_id });

            const post = await models.Post.findByPk(post_id);
            if (!post) {
                return { error: { code: 404, message: "Post not found" } };
            }

            await post.increment('like_count');

            return {
                result: {
                    message: "Liked successfully",
                    notify: {
                        receiver_id: post.user_id,
                        action_type: 'like',
                        action_id: post_id,
                        content: `liked your post`
                    }
                }
            };
        } catch (err) {
            return {
                error: {
                    code: 500,
                    message: "Internal server error",
                    detail: err.message
                }
            };
        }
    },
    async unlikePost(user_id, post_id) {
        try {
            const existing = await models.Like.findOne({ where: { user_id, post_id } });
            if (!existing) {
                return { error: { code: 400, message: "You haven't liked this post" } };
            }

            await existing.destroy();
            await models.Post.decrement('like_count', { by: 1, where: { id: post_id } });

            return { result: "Unliked successfully" };
        } catch (err) {
            return { error: { code: 500, message: "Internal server error", detail: err.message } };
        }
    },
    async postLiked(user_id) {
        if (!user_id) {
            return { error: { code: 400, message: "user_id is required" } };
        }

        try {
            const postLiked = await Like.findAll({ where: { user_id } });
            const postLikedId = postLiked.map(p => p.post_id);

            if (postLikedId.length === 0) {
                return { result: [] }; 
            }

            const postLikedInfo = await Post.findAll({
                where: {
                    id: { [Op.in]: postLikedId },
                },
            });
            return { result: postLikedInfo };
        } catch (error) {
            return { error: { code: 500, message: "Internal server error", detail: error.message } };
        }
    }
}