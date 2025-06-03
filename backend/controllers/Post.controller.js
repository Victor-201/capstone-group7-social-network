import models from '../models/index.js';
import { uploadMultipleMedia } from '../helpers/multer.helper.js';

const { Post, PostMedia } = models;

export const CreatePost = async (req, res) => {
    const user_id = req.user.id;

    console.log('Body:', req.body);
    console.log('Files:', req.files);

    try {
        const content = req.body.content || '';
        const accessModifier = req.body.accessModifier || 'public';

        const files = Array.isArray(req.files) ? req.files : [];
        const mediaResults = uploadMultipleMedia(files);

        const post = await Post.create({
            content,
            user_id,
            access_modifier: accessModifier,
        });

        if (mediaResults.length > 0) {
            const mediaRecords = mediaResults.map((file) => ({
                post_id: post.id,
                media_url: file.public_id,
                media_type: file.media_type || null,
            }));

            await PostMedia.bulkCreate(mediaRecords);
        }

        return res.status(201).json({
            message: 'Post created successfully',
            post,
        });

    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const GetPosts = async (req, res) => {
    const user_id = req.user.id;
    try {
        const posts = await Post.findAll({
            where: { user_id },
            include: [
                {
                    model: PostMedia,
                    as: 'media',
                    attributes: ['media_url', 'media_type'],
                },
            ],
            order: [['created_at', 'DESC']],
        });

        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const PostDetail = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Post.findOne({
            where: { id: postId },
            include: [
                {
                    model: PostMedia,
                    as: 'media',
                    attributes: ['media_url', 'media_type'],
                },
            ],
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post detail:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const editPost = async (req, res) => {
    const postId = req.params.id;
    const { content, accessModifier } = req.body;
    const user_id = req.user.id;
    console.log(req.body);
    try {
        const post = await Post.findOne({ where: { id: postId, user_id } });

        if (!post) {
            return res.status(404).json({ message: 'Post not found or you do not have permission to edit this post' });
        }
        post.content = content || post.content;
        post.access_modifier = accessModifier || post.access_modifier;
        await post.save();

        return res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deletePost = async (req, res) => {
    const postId = req.params.id;
    const user_id = req.user.id;

    try {
        const post = await Post.findOne({ where: { id: postId, user_id } });

        if (!post) {
            return res.status(404).json({ message: 'Post not found or you do not have permission to delete this post' });
        }

        await post.destroy();
        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const sharePost = async (req, res) => {
    const postId = req.params.id;
    const user_id = req.user.id;
    try {
        const originalPost = await Post.findOne({ where: { id: postId } });

        if (!originalPost) {
            return res.status(404).json({ message: 'Original post not found' });
        }

        const originalPostId = originalPost.shared_post_id || originalPost.id;

        const sharedPost = await Post.create({
            content: originalPost.content,
            user_id,
            access_modifier: originalPost.access_modifier,
            shared_post_id: originalPostId,
        });

        return res.status(201).json({
            message: 'Post shared successfully',
            post: sharedPost,
        });
    } catch (error) {
        console.error('Error sharing post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}