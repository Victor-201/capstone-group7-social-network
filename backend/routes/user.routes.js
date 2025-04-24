const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Cập nhật thông tin cá nhân (bao gồm avatar)
router.put('/profile', verifyToken, userController.updateProfile);

// Đổi mật khẩu
router.put('/change-password', verifyToken, userController.changePassword);

// Upload ảnh đại diện
router.post('/upload-avatar', verifyToken, upload.single('avatar'), userController.uploadAvatar);

module.exports = router;