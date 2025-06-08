import models from '../models/index.js';
const { Comment } = models;

export const createComment = async (req, res) => {
  const post_id = req.params.id;
  const { content, parent_comment_id } = req.body;
  const user_id = req.user.id;

  try {
    const comment = await Comment.create({
      post_id,
      user_id,
      content,
    });

    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const replyToComment = async (req, res) => {
  const parent_comment_id = req.params.id;
  const { content } = req.body;
  const user_id = req.user.id;

  try {
    const parentComment = await Comment.findOne({
      where: { id: parent_comment_id }
    });

    if (!parentComment) {
      return res.status(404).json({ message: 'Parent comment not found' });
    }

    const reply = await Comment.create({
      post_id: parentComment.post_id,
      user_id,
      content,
      parent_comment_id: parent_comment_id
    });

    res.status(201).json({
      message: 'Reply created successfully',
      reply
    });

  } catch (error) {
    console.error('Error replying to comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteComment = async (req, res) => {
  const comment_id = req.params.id;
  const user_id = req.user.id;

  try {
    const comment = await Comment.findOne({
      where: { id: comment_id, user_id }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or you do not have permission to delete it' });
    }

    await comment.destroy();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}