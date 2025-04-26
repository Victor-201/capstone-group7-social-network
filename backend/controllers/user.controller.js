const { initModels } = require('../config/database');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

// Khởi tạo models
const models = initModels();
const User = models.User;

// Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, bio, location, workplace, education, relationship } = req.body;
    
    console.log('Update profile request body:', req.body);
    console.log('Update profile files:', req.files);
    
    // Tìm người dùng
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cập nhật thông tin cơ bản
    if (fullName !== undefined) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (workplace !== undefined) user.workplace = workplace;
    if (education !== undefined) user.education = education;
    if (relationship !== undefined) user.relationship = relationship;

    // Kiểm tra và xử lý ảnh đại diện nếu có
    if (req.files && req.files.avatar) {
      // Xóa avatar cũ nếu có
      if (user.avatar && user.avatar !== '/images/default-avatar.png' && !user.avatar.includes('http')) {
        const avatarPath = user.avatar.startsWith('/') ? user.avatar.substring(1) : user.avatar;
        const oldAvatarPath = path.join(__dirname, '..', avatarPath);
        
        try {
          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
            console.log('Old avatar deleted successfully');
          }
        } catch (err) {
          console.error('Error deleting old avatar:', err);
        }
      }
      
      // Cập nhật đường dẫn mới
      user.avatar = `/uploads/avatars/${req.files.avatar[0].filename}`;
    }
    
    // Kiểm tra và xử lý ảnh bìa nếu có
    if (req.files && req.files.coverImage) {
      // Xóa ảnh bìa cũ nếu có
      if (user.coverImage && !user.coverImage.includes('http')) {
        const coverPath = user.coverImage.startsWith('/') ? user.coverImage.substring(1) : user.coverImage;
        const oldCoverPath = path.join(__dirname, '..', coverPath);
        
        try {
          if (fs.existsSync(oldCoverPath)) {
            fs.unlinkSync(oldCoverPath);
            console.log('Old cover image deleted successfully');
          }
        } catch (err) {
          console.error('Error deleting old cover image:', err);
        }
      }
      
      // Cập nhật đường dẫn mới
      user.coverImage = `/uploads/covers/${req.files.coverImage[0].filename}`;
    }

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
        coverImage: user.coverImage,
        bio: user.bio,
        location: user.location,
        workplace: user.workplace,
        education: user.education,
        relationship: user.relationship
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
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
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload ảnh đại diện
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const { fullName, bio, location, workplace, education, relationship } = req.body;
    
    // Tìm người dùng
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Xóa avatar cũ nếu có
    if (user.avatar && user.avatar !== '/images/default-avatar.png') {
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
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (workplace !== undefined) user.workplace = workplace;
    if (education !== undefined) user.education = education;
    if (relationship !== undefined) user.relationship = relationship;

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
        coverImage: user.coverImage,
        bio: user.bio,
        location: user.location,
        workplace: user.workplace,
        education: user.education,
        relationship: user.relationship
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

// Upload ảnh bìa
exports.uploadCoverImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    
    // Tìm người dùng
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Xóa ảnh bìa cũ nếu có
    if (user.coverImage) {
      const coverPath = user.coverImage.startsWith('/') ? user.coverImage.substring(1) : user.coverImage;
      const oldCoverPath = path.join(__dirname, '..', coverPath);
      
      console.log('Attempting to delete old cover image:', oldCoverPath);
      
      if (fs.existsSync(oldCoverPath)) {
        fs.unlinkSync(oldCoverPath);
        console.log('Old cover image deleted successfully');
      } else {
        console.log('Old cover image file not found, nothing to delete');
      }
    }

    // Cập nhật đường dẫn ảnh bìa mới
    const coverUrl = `/uploads/covers/${req.file.filename}`;
    console.log('New cover image URL:', coverUrl);
    user.coverImage = coverUrl;

    // Lưu thay đổi
    await user.save();

    // Trả về thông tin đã cập nhật
    res.json({
      message: 'Ảnh bìa đã được cập nhật thành công',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        coverImage: user.coverImage,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Upload cover image error:', error);
    
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
      attributes: [
        'id', 'username', 'fullName', 'avatar', 'coverImage', 'bio', 
        'location', 'workplace', 'education', 'relationship', 'createdAt'
      ]
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
    
    // Trả về thông tin người dùng cùng với các thông tin bổ sung
    res.json({
      ...user.toJSON(),
      friendshipStatus,
      isFollowing,
      friendsCount,
      followersCount,
      followingCount
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};