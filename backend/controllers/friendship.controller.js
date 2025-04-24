const { sequelize, initModels, Op } = require('../config/database');

// Initialize models
const models = initModels();
const User = models.User;
const Friendship = models.Friendship;

// Helper function to ensure correct order of user IDs
const orderUserIds = (id1, id2) => {
  const userId1 = parseInt(id1);
  const userId2 = parseInt(id2);
  return userId1 < userId2 ? { userId1, userId2 } : { userId1: userId2, userId2: userId1 };
};

// Send a friend request
exports.sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    if (senderId === parseInt(receiverId)) {
      return res.status(400).json({ message: 'Bạn không thể kết bạn với chính mình' });
    }

    // Check if receiver exists
    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Order user IDs to maintain consistency (userId1 is always smaller than userId2)
    const { userId1, userId2 } = orderUserIds(senderId, receiverId);

    // Check if a friendship already exists
    let friendship = await Friendship.findOne({
      where: {
        userId1: userId1,
        userId2: userId2
      }
    });

    if (friendship) {
      if (friendship.status === 'pending') {
        if (friendship.actionUserId === senderId) {
          return res.status(400).json({ message: 'Bạn đã gửi lời mời kết bạn rồi' });
        } else {
          // If receiver sent a request to sender before, accept it automatically
          friendship.status = 'accepted';
          friendship.actionUserId = senderId;
          await friendship.save();
          return res.status(200).json({ message: 'Đã chấp nhận lời mời kết bạn' });
        }
      } else if (friendship.status === 'accepted') {
        return res.status(400).json({ message: 'Các bạn đã là bạn bè rồi' });
      } else if (friendship.status === 'declined') {
        friendship.status = 'pending';
        friendship.actionUserId = senderId;
        await friendship.save();
        return res.status(200).json({ message: 'Đã gửi lời mời kết bạn' });
      } else if (friendship.status === 'blocked') {
        return res.status(403).json({ message: 'Không thể gửi lời mời kết bạn' });
      }
    }

    // Create new friendship
    friendship = await Friendship.create({
      userId1: userId1,
      userId2: userId2,
      status: 'pending',
      actionUserId: senderId
    });

    res.status(201).json({
      message: 'Đã gửi lời mời kết bạn',
      friendship
    });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Accept a friend request
exports.respondFriendRequest = async (req, res) => {
  try {
    const responderId = req.user.id;
    const { requesterId, action } = req.body;

    if (!['accept', 'decline', 'block'].includes(action)) {
      return res.status(400).json({ message: 'Hành động không hợp lệ' });
    }

    // Order user IDs to maintain consistency
    const { userId1, userId2 } = orderUserIds(responderId, requesterId);

    // Find the friendship
    const friendship = await Friendship.findOne({
      where: {
        userId1: userId1,
        userId2: userId2,
        status: 'pending'
      }
    });

    if (!friendship) {
      return res.status(404).json({ message: 'Không tìm thấy lời mời kết bạn' });
    }

    // Check if the responder is the one who received the request
    if (friendship.actionUserId === responderId) {
      return res.status(400).json({ message: 'Bạn không thể trả lời lời mời mà chính bạn đã gửi' });
    }

    // Update friendship status based on action
    let status;
    switch (action) {
      case 'accept':
        status = 'accepted';
        break;
      case 'decline':
        status = 'declined';
        break;
      case 'block':
        status = 'blocked';
        break;
    }

    friendship.status = status;
    friendship.actionUserId = responderId;
    await friendship.save();

    res.status(200).json({
      message: `Đã ${action === 'accept' ? 'chấp nhận' : action === 'decline' ? 'từ chối' : 'chặn'} lời mời kết bạn`,
      friendship
    });
  } catch (error) {
    console.error('Respond to friend request error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Remove a friend
exports.removeFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    // Order user IDs to maintain consistency
    const { userId1, userId2 } = orderUserIds(userId, friendId);

    // Find the friendship
    const friendship = await Friendship.findOne({
      where: {
        userId1: userId1,
        userId2: userId2,
        status: 'accepted'
      }
    });

    if (!friendship) {
      return res.status(404).json({ message: 'Không tìm thấy mối quan hệ bạn bè' });
    }

    // Set the friendship status to declined
    friendship.status = 'declined';
    friendship.actionUserId = userId;
    await friendship.save();

    res.status(200).json({
      message: 'Đã xóa khỏi danh sách bạn bè',
      friendship
    });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Block a user
exports.blockUser = async (req, res) => {
  try {
    const blockerId = req.user.id;
    const { blockedId } = req.params;

    if (blockerId === parseInt(blockedId)) {
      return res.status(400).json({ message: 'Bạn không thể chặn chính mình' });
    }

    // Order user IDs to maintain consistency
    const { userId1, userId2 } = orderUserIds(blockerId, blockedId);

    // Find existing friendship
    let friendship = await Friendship.findOne({
      where: {
        userId1: userId1,
        userId2: userId2
      }
    });

    if (friendship) {
      friendship.status = 'blocked';
      friendship.actionUserId = blockerId;
      await friendship.save();
    } else {
      // Create new blocked relationship if none exists
      friendship = await Friendship.create({
        userId1: userId1,
        userId2: userId2,
        status: 'blocked',
        actionUserId: blockerId
      });
    }

    res.status(200).json({
      message: 'Đã chặn người dùng',
      friendship
    });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Unblock a user
exports.unblockUser = async (req, res) => {
  try {
    const unblockerId = req.user.id;
    const { unblockedId } = req.params;

    // Order user IDs to maintain consistency
    const { userId1, userId2 } = orderUserIds(unblockerId, unblockedId);

    // Find the block relationship
    const friendship = await Friendship.findOne({
      where: {
        userId1: userId1,
        userId2: userId2,
        status: 'blocked',
        actionUserId: unblockerId // Only the blocker can unblock
      }
    });

    if (!friendship) {
      return res.status(404).json({ message: 'Không tìm thấy mối quan hệ chặn' });
    }

    // Set the relationship to declined (no longer friends or blocked)
    friendship.status = 'declined';
    await friendship.save();

    res.status(200).json({
      message: 'Đã bỏ chặn người dùng',
      friendship
    });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Get list of friends
exports.getFriendsList = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    // Find user
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    // Get friends where user can be either userId1 or userId2
    const friendships = await Friendship.findAll({
      where: {
        [Op.or]: [
          { userId1: userId },
          { userId2: userId }
        ],
        status: 'accepted'
      }
    });
    
    // Extract friend IDs
    const friendIds = friendships.map(friendship => {
      return friendship.userId1 == userId ? friendship.userId2 : friendship.userId1;
    });
    
    // Fetch friend details
    const friends = await User.findAll({
      where: {
        id: friendIds
      },
      attributes: ['id', 'username', 'fullName', 'avatar', 'bio']
    });
    
    res.status(200).json(friends);
  } catch (error) {
    console.error('Get friends list error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Get pending friend requests
exports.getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find incoming friend requests
    const incomingRequests = await Friendship.findAll({
      where: {
        [Op.or]: [
          { userId1: userId, actionUserId: { [Op.ne]: userId } },
          { userId2: userId, actionUserId: { [Op.ne]: userId } }
        ],
        status: 'pending'
      },
      include: [
        {
          model: User,
          as: 'user1',
          attributes: ['id', 'username', 'fullName', 'avatar']
        },
        {
          model: User,
          as: 'user2',
          attributes: ['id', 'username', 'fullName', 'avatar']
        }
      ]
    });
    
    // Transform data to get requester info
    const requests = incomingRequests.map(request => {
      const requesterId = request.actionUserId;
      const requesterInfo = request.user1.id === requesterId ? request.user1 : request.user2;
      
      return {
        id: request.id,
        requester: {
          id: requesterInfo.id,
          username: requesterInfo.username,
          fullName: requesterInfo.fullName,
          avatar: requesterInfo.avatar
        },
        createdAt: request.createdAt
      };
    });
    
    res.status(200).json(requests);
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Get sent friend requests
exports.getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find outgoing friend requests
    const outgoingRequests = await Friendship.findAll({
      where: {
        [Op.or]: [
          { userId1: userId },
          { userId2: userId }
        ],
        actionUserId: userId,
        status: 'pending'
      },
      include: [
        {
          model: User,
          as: 'user1',
          attributes: ['id', 'username', 'fullName', 'avatar']
        },
        {
          model: User,
          as: 'user2',
          attributes: ['id', 'username', 'fullName', 'avatar']
        }
      ]
    });
    
    // Transform data to get receiver info
    const requests = outgoingRequests.map(request => {
      const receiverId = request.user1.id === userId ? request.user2.id : request.user1.id;
      const receiverInfo = request.user1.id === receiverId ? request.user1 : request.user2;
      
      return {
        id: request.id,
        receiver: {
          id: receiverInfo.id,
          username: receiverInfo.username,
          fullName: receiverInfo.fullName,
          avatar: receiverInfo.avatar
        },
        createdAt: request.createdAt
      };
    });
    
    res.status(200).json(requests);
  } catch (error) {
    console.error('Get sent requests error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};