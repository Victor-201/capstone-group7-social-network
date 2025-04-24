const { initModels } = require('../config/database');
const bcrypt = require('bcryptjs');

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