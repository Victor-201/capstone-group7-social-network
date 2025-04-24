const express = require('express');
const router = express.Router();
const friendshipController = require('../controllers/friendship.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Friend request routes
router.post('/request', verifyToken, friendshipController.sendFriendRequest);
router.post('/respond', verifyToken, friendshipController.respondFriendRequest);
router.delete('/:friendId', verifyToken, friendshipController.removeFriend);

// Block/unblock routes
router.post('/block/:blockedId', verifyToken, friendshipController.blockUser);
router.post('/unblock/:unblockedId', verifyToken, friendshipController.unblockUser);

// Friend list routes
router.get('/list', verifyToken, friendshipController.getFriendsList);
router.get('/list/:userId', friendshipController.getFriendsList);
router.get('/pending', verifyToken, friendshipController.getPendingRequests);
router.get('/sent', verifyToken, friendshipController.getSentRequests);

module.exports = router;