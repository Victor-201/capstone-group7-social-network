const jwt = require('jsonwebtoken');
const { initModels } = require('../config/database');

// Khởi tạo models
const models = initModels();
const User = models.User;

exports.verifyToken = async (req, res, next) => {
  try {
    // Lấy token từ header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token xác thực'
      });
    }

    // Xác minh token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your_jwt_secret_key'
    );
    
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Kiểm tra trạng thái kích hoạt
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản đã bị vô hiệu hóa'
      });
    }

    // Gán thông tin người dùng vào request
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi xác thực',
      error: error.message
    });
  }
};