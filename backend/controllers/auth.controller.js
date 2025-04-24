const { sequelize, initModels, Op } = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Thay đổi từ bcrypt sang bcryptjs

// Khởi tạo models
const models = initModels();
const User = models.User;

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Check if user already exists - Chỉ định cụ thể các cột cần truy vấn
    const existingUser = await User.findOne({ 
      where: { email },
      attributes: ['id', 'email'] // Chỉ chọn các cột cần thiết
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password, // Sẽ được hash trong hooks
      fullName
    });

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email - Chỉ định cụ thể các cột cần truy vấn
    const user = await User.findOne({ 
      where: {
        [Op.or]: [
          { username: username },
          { email: username }
        ]
      },
      attributes: ['id', 'username', 'email', 'password', 'fullName', 'avatar', 'role', 'isActive'] // Chỉ chọn các cột cần thiết
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'fullName', 'avatar', 'bio', 'isActive', 'role'] // Chỉ định các cột cần truy vấn
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};