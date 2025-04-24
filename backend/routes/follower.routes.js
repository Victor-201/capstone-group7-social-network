const express = require('express');
const router = express.Router();
const followerController = require('../controllers/follower.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Follow/unfollow routes
router.post('/:followedId', verifyToken, followerController.followUser);
router.delete('/:followedId', verifyToken, followerController.unfollowUser);

// Followers/following lists
router.get('/followers', verifyToken, followerController.getFollowers);
router.get('/followers/:userId', followerController.getFollowers);
router.get('/following', verifyToken, followerController.getFollowing);
router.get('/following/:userId', followerController.getFollowing);

// Check follow status
router.get('/check/:followedId', verifyToken, followerController.checkFollowStatus);

module.exports = router;