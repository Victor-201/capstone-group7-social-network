import models from '../models/index.js';
import { Op } from 'sequelize';

const { Friend, UserInfo } = models;

const extractFriendIds = (records, targetId) =>
  records.map(r => r.user_id === targetId ? r.friend_id : r.user_id);

export default {
  async sendFriendRequest(user_id, friend_id) {
    if (!friend_id || user_id === friend_id) {
      return { error: { code: 400, message: "Invalid action" } };
    }

    const existing = await Friend.findOne({
      where: {
        [Op.or]: [
          { user_id, friend_id },
          { user_id: friend_id, friend_id: user_id }
        ],
        status: { [Op.in]: ['pending', 'accepted'] }
      }
    });

    if (existing) {
      return { error: { code: 400, message: "Friend request already exists or already friends" } };
    }

    const friend = await Friend.create({ user_id, friend_id, status: 'pending' });
    return { result: { success: true, message: "Friend request sent successfully", friend } };
  },
  
  async respondToFriendRequest(user_id, friend_id, status) {
    if (user_id === friend_id) {
      return { error: { code: 400, message: "Cannot perform this action" } };
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return { error: { code: 400, message: "Invalid status value" } };
    }

    const request = await Friend.findOne({
      where: { user_id: friend_id, friend_id: user_id }
    });

    if (!request) {
      return { error: { code: 404, message: "Friend request not found" } };
    }

    request.status = status;
    await request.save();

    return {
      result: {
        success: true,
        message: `Friend request ${status}`,
        request,
        notify: {
          sendTo: friend_id,
          action_id: request.id,
          content: `${status === 'accepted' ? 'accepted your friend request' : 'rejected your friend request'}`,
        }
      }
    };
  },

  async getMutualFriends(user_id, friend_id) {
    if (!friend_id || user_id === friend_id) {
      return { error: { code: 400, message: "Invalid user" } };
    }

    const aFriends = await Friend.findAll({
      where: {
        status: 'accepted',
        [Op.or]: [{ user_id }, { friend_id: user_id }]
      },
      attributes: ['user_id', 'friend_id']
    });

    const bFriends = await Friend.findAll({
      where: {
        status: 'accepted',
        [Op.or]: [{ user_id: friend_id }, { friend_id: friend_id }]
      },
      attributes: ['user_id', 'friend_id']
    });

    const aSet = new Set(extractFriendIds(aFriends, user_id));
    const bSet = new Set(extractFriendIds(bFriends, friend_id));

    const mutualIds = [...aSet].filter(id => bSet.has(id));
    if (mutualIds.length === 0) {
      return { error: { code: 404, message: "No mutual friends found" } };
    }

    const mutualFriends = await UserInfo.findAll({
      where: { id: { [Op.in]: mutualIds } },
      attributes: ['id', 'full_name', 'avatar']
    });

    return { result: { mutualFriends }, count: mutualIds.length};
  },

  async getFriendsList(user_id) {
    const sent = await Friend.findAll({
      where: { user_id, status: 'accepted' },
      include: [{ model: UserInfo, as: 'Recipient', attributes: ['id', 'full_name', 'avatar'] }]
    });

    const received = await Friend.findAll({
      where: { friend_id: user_id, status: 'accepted' },
      include: [{ model: UserInfo, as: 'Requester', attributes: ['id', 'full_name', 'avatar'] }]
    });

    const friends = [
      ...sent.map(f => f.Recipient),
      ...received.map(f => f.Requester)
    ];

    return { result: { friends } };
  },

  async deleteFriend(user_id, friend_id) {
    if (!friend_id || user_id === friend_id) {
      return { error: { code: 400, message: "Invalid user" } };
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
      return { error: { code: 404, message: "Friend not found" } };
    }

    await friend.destroy();
    return { result: { success: true, message: "Friend deleted successfully" } };
  },

  async getSentRequests(user_id) {
    const sentRequests = await Friend.findAll({
      where: { user_id, status: 'pending' },
      include: [{ 
        model: UserInfo, 
        as: 'Recipient', 
        attributes: ['id', 'full_name', 'avatar'] 
      }]
    });

    return { result: { requests: sentRequests } };
  },

  async getReceivedRequests(user_id) {
    const receivedRequests = await Friend.findAll({
      where: { friend_id: user_id, status: 'pending' },
      include: [{ 
        model: UserInfo, 
        as: 'Requester', 
        attributes: ['id', 'full_name', 'avatar'] 
      }]
    });

    return { result: { requests: receivedRequests } };
  },

  async isFriend(user_id, friend_id) {
    if (!friend_id || user_id === friend_id) {
      return { error: { code: 400, message: "Invalid user" } };
    }

    try {
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
      return { isFriend: false };
    }
    return { isFriend: true };
    } catch (error) {
      return { error: { code: 500, message: "Server internal error" } };
    }
  },
};
