const { initModels } = require('../config/database');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

// Khởi tạo models
const models = initModels();
const User = models.User;

// Cập nhật thông tin người dùng
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, avatar, bio } = req.body;

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cập nhật thông tin
    if (fullName) user.fullName = fullName;
    if (avatar) user.avatar = avatar;
    if (bio) user.bio = bio;

    // Lưu thay đổi
    await user.save();

    // Trả về thông tin đã cập nhật
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Tìm người dùng
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Lưu thay đổi
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload và cập nhật ảnh đại diện
exports.uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, bio } = req.body;

    // Debug log
    console.log('File upload request received:', req.file);

    // Kiểm tra xem có file được tải lên không
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file ảnh nào được tải lên' });
    }

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findByPk(userId);
    
    if (!user) {
      // Xóa file nếu không tìm thấy người dùng để tránh rác
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'User not found' });
    }

    // Nếu người dùng đã có avatar tùy chỉnh trước đó (không phải mặc định), xóa file cũ
    if (user.avatar && !user.avatar.startsWith('http') && !user.avatar.startsWith('/uploads/avatars/default-avatar.png')) {
      // Remove the leading slash if it exists for correct path resolution
      const avatarPath = user.avatar.startsWith('/') ? user.avatar.substring(1) : user.avatar;
      const oldAvatarPath = path.join(__dirname, '..', avatarPath);
      
      console.log('Attempting to delete old avatar:', oldAvatarPath);
      
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
        console.log('Old avatar deleted successfully');
      } else {
        console.log('Old avatar file not found, nothing to delete');
      }
    }

    // Cập nhật đường dẫn avatar mới
    // Tạo URL tương đối cho avatar
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    console.log('New avatar URL:', avatarUrl);
    user.avatar = avatarUrl;

    // Cập nhật các thông tin khác nếu có
    if (fullName) user.fullName = fullName;
    if (bio) user.bio = bio;

    // Lưu thay đổi
    await user.save();

    // Trả về thông tin đã cập nhật
    res.json({
      message: 'Ảnh đại diện đã được cập nhật thành công',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    
    // Xóa file trong trường hợp xảy ra lỗi
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('Deleted uploaded file due to error');
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};

// Tìm kiếm người dùng
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Tìm người dùng theo username hoặc fullName
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${query}%` } },
          { fullName: { [Op.like]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'username', 'fullName', 'avatar', 'bio'],
      limit: 20
    });
    
    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Lấy thông tin người dùng theo ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'fullName', 'avatar', 'bio', 'createdAt']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    // Nếu có người dùng đang đăng nhập, kiểm tra các thông tin về kết bạn
    let friendshipStatus = null;
    let isFollowing = false;
    
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const authMiddleware = require('../middleware/auth.middleware');
        const decoded = authMiddleware.decodeToken(token);
        
        if (decoded?.id && decoded.id !== parseInt(userId)) {
          // Kiểm tra trạng thái kết bạn
          const { userId1, userId2 } = decoded.id < parseInt(userId) 
            ? { userId1: decoded.id, userId2: parseInt(userId) }
            : { userId1: parseInt(userId), userId2: decoded.id };

          const friendship = await models.Friendship.findOne({
            where: {
              userId1,
              userId2
            }
          });
          
          if (friendship) {
            friendshipStatus = {
              status: friendship.status,
              actionUserId: friendship.actionUserId
            };
          }
          
          // Kiểm tra xem có đang theo dõi hay không
          const follow = await models.Follower.findOne({
            where: {
              followerId: decoded.id,
              followedId: userId
            }
          });
          
          isFollowing = !!follow;
        }
      } catch (err) {
        console.error("Auth check error:", err);
      }
    }
    
    // Thêm số lượng bạn bè và người theo dõi
    const friendsCount = await models.Friendship.count({
      where: {
        [Op.or]: [
          { userId1: userId },
          { userId2: userId }
        ],
        status: 'accepted'
      }
    });
    
    const followersCount = await models.Follower.count({
      where: {
        followedId: userId
      }
    });
    
    const followingCount = await models.Follower.count({
      where: {
        followerId: userId
      }
    });
    
    // Số lượng bài viết
    const postsCount = await models.Post.count({
      where: {
        userId: userId
      }
    });
    
    res.json({
      ...user.toJSON(),
      friendshipStatus,
      isFollowing,
      stats: {
        friendsCount,
        followersCount,
        followingCount,
        postsCount
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};