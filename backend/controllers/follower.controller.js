const { sequelize, initModels, Op } = require('../config/database');

// Initialize models
const models = initModels();
const User = models.User;
const Follower = models.Follower;

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { followedId } = req.params;

    if (followerId === parseInt(followedId)) {
      return res.status(400).json({ message: 'Bạn không thể theo dõi chính mình' });
    }

    // Check if user to follow exists
    const followedUser = await User.findByPk(followedId);
    if (!followedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Check if already following
    const existingFollow = await Follower.findOne({
      where: {
        followerId: followerId,
        followedId: followedId
      }
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'Bạn đã theo dõi người dùng này rồi' });
    }

    // Create new follow relationship
    const follow = await Follower.create({
      followerId: followerId,
      followedId: followedId
    });

    res.status(201).json({
      message: 'Đã theo dõi người dùng',
      follow
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { followedId } = req.params;

    // Check if follow relationship exists
    const follow = await Follower.findOne({
      where: {
        followerId: followerId,
        followedId: followedId
      }
    });

    if (!follow) {
      return res.status(404).json({ message: 'Bạn chưa theo dõi người dùng này' });
    }

    // Delete the follow relationship
    await follow.destroy();

    res.status(200).json({
      message: 'Đã hủy theo dõi người dùng'
    });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Get list of followers
exports.getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    // Find user
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Get followers
    const followers = await User.findAll({
      include: [{
        model: User,
        as: 'following',
        through: {
          where: {
            followedId: userId
          }
        },
        attributes: []
      }],
      attributes: ['id', 'username', 'fullName', 'avatar', 'bio']
    });

    res.status(200).json(followers);
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Get list of users that a user is following
exports.getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    // Find user
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Get following
    const following = await User.findAll({
      include: [{
        model: User,
        as: 'followers',
        through: {
          where: {
            followerId: userId
          }
        },
        attributes: []
      }],
      attributes: ['id', 'username', 'fullName', 'avatar', 'bio']
    });

    res.status(200).json(following);
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Check if user follows another user
exports.checkFollowStatus = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { followedId } = req.params;

    const follow = await Follower.findOne({
      where: {
        followerId: followerId,
        followedId: followedId
      }
    });

    res.status(200).json({
      isFollowing: !!follow
    });
  } catch (error) {
    console.error('Check follow status error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};