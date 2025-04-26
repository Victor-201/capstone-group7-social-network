const { sequelize, initModels, Op } = require('../config/database');

// Initialize models
const models = initModels();
const Post = models.Post;
const User = models.User;
const Share = models.Share;

// Share a post
exports.sharePost = async (req, res) => {
  try {
    const { postId, content, privacy } = req.body;
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }

    // Create share record
    const newShare = await Share.create({
      userId,
      postId,
      content: content || '',
      privacy: privacy || 'public'
    });

    // Load the full share data with relations
    const share = await Share.findByPk(newShare.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName', 'avatar']
        },
        {
          model: Post,
          as: 'post',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'fullName', 'avatar']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      message: 'Đã chia sẻ bài viết thành công',
      share
    });
  } catch (error) {
    console.error('Share post error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Get shares of a post
exports.getPostShares = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const shares = await Share.findAll({
      where: { postId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName', 'avatar']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json(shares);
  } catch (error) {
    console.error('Get post shares error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Delete a share
exports.deleteShare = async (req, res) => {
  try {
    const { shareId } = req.params;
    const userId = req.user.id;

    const share = await Share.findByPk(shareId);
    
    if (!share) {
      return res.status(404).json({ message: 'Không tìm thấy bài chia sẻ' });
    }
    
    // Check if user owns the share
    if (share.userId !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa bài chia sẻ này' });
    }
    
    await share.destroy();
    
    res.status(200).json({ message: 'Đã xóa bài chia sẻ thành công' });
  } catch (error) {
    console.error('Delete share error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};