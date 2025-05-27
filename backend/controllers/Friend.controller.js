import models from '../models/index.js';
import {Op} from 'sequelize';

const { Friend, UserInfo } = models;

export const sendFriendRequest = async (req, res) => {
  const { friend_id } = req.body;
  const user_id = req.user.id;

  if (!friend_id || user_id === friend_id) {
    return res.status(400).json({ message: "Invalid action" });
  }

  try {
    const existingRequest = await Friend.findOne({
      where: {
        [Op.or]: [
          { user_id, friend_id },
          { user_id: friend_id, friend_id: user_id }
        ],
        status: {
          [Op.in]: ['pending', 'accepted']
        }
      }
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists or already friends" });
    }
    await Friend.create({
      user_id,
      friend_id,
      status: 'pending'
    });

    return res.status(201).json({ message: "Friend request sent successfully" });

  } catch (error) {
    console.error("Error sending friend request:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const respondToFriendRequest = async (req, res) => {
    const { friend_id, status } = req.body;
    const user_id = req.user.id;
    if (user_id === friend_id) {
        return res.status(400).json({ message: "Cannot do this action" });
    }
    
    try {
        const friendRequest = await Friend.findOne({
          where: { user_id: friend_id, friend_id: user_id }
        });
    
        if (!friendRequest) {
          return res.status(404).json({ message: "Friend request not found" });
        }
    
        friendRequest.status = status;
        await friendRequest.save();
    
        return res.status(200).json({ message: "Friend request updated successfully" });
    } catch (error) {
        console.error("Error responding to friend request:", error);
        return res.status(500).json({ message: "Error" });
    }
}


export const getMutualFriends = async (req, res) => {
  try {
    const { friend_id } = req.params;
    const user_id = req.user.id;

    if (!friend_id || user_id === friend_id) {
      return res.status(400).json({ message: "Invalid user" });
    }

    const aFriends = await Friend.findAll({
      where: {
        status: 'accepted',
        [Op.or]: [
          { user_id },
          { friend_id: user_id }
        ]
      },
      attributes: ['user_id', 'friend_id']
    });

    const bFriends = await Friend.findAll({
      where: {
        status: 'accepted',
        [Op.or]: [
          { user_id: friend_id },
          { friend_id: friend_id }
        ]
      },
      attributes: ['user_id', 'friend_id']
    });

    const extractFriendIds = (records, targetId) =>
      records.map(r => r.user_id === targetId ? r.friend_id : r.user_id);

    const aFriendIds = new Set(extractFriendIds(aFriends, user_id));
    const bFriendIds = new Set(extractFriendIds(bFriends, friend_id));

    const mutualIds = [...aFriendIds].filter(id => bFriendIds.has(id));

    if (mutualIds.length === 0) {
      return res.status(404).json({ message: "No mutual friends found" });
    }

    const mutualFriends = await UserInfo.findAll({
      where: { id: { [Op.in]: mutualIds } },
      attributes: ['id', 'full_name', 'avatar']
    });

    return res.status(200).json({ mutualFriends });
  } catch (error) {
    console.error("Error getting mutual friends:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getFriendsList = async (req, res) => {
  try {
    const user_id = req.user.id;

    const sent = await Friend.findAll({
      where: { user_id, status: 'accepted' },
      include: [{ model: UserInfo, as: 'Recipient', attributes: ['id', 'full_name', 'avatar'] }]
    });

    const received = await Friend.findAll({
      where: { friend_id: user_id, status: 'accepted' },
      include: [{ model: UserInfo, as: 'Requester', attributes: ['id', 'full_name', 'avatar'] }]
    });

    // Gộp lại
    const friends = [
      ...sent.map(f => f.Recipient),
      ...received.map(f => f.Requester)
    ];

    if (friends.length === 0) {
      return res.status(404).json({ message: "No friends found" });
    }

    return res.status(200).json({ friends });
  } catch (error) {
    console.error("Error getting friend list:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteFriend = async (req, res) => {
  try {
    const friend_id = req.params.id;
    const user_id = req.user.id;
    if (!friend_id || user_id === friend_id) {
      return res.status(400).json({ message: "Invalid user" });
    }
    const friend = await Friend.findOne({
      where: {
        status: 'accepted',
        [Op.or]: [
          { user_id, friend_id },
          { user_id: friend_id, friend_id: user_id }
        ]
      }
    });
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }
    await friend.destroy();
    return res.status(200).json({ message: "Friend deleted successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}