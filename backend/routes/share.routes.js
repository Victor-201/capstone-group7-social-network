const express = require('express');
const router = express.Router();
const shareController = require('../controllers/share.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Chia sẻ bài viết
router.post('/', verifyToken, shareController.sharePost);

// Lấy danh sách chia sẻ của bài viết
router.get('/post/:postId', shareController.getPostShares);

// Xóa bài chia sẻ
router.delete('/:shareId', verifyToken, shareController.deleteShare);

module.exports = router;