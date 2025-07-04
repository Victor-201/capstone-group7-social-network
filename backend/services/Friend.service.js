import models from '../models/index.js';
import { Op } from 'sequelize';

const { Friend, UserInfo, UserAccount } = models;

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

    // Lấy danh sách bạn bè của user A
    const aFriends = await Friend.findAll({
      where: {
        status: 'accepted',
        [Op.or]: [{ user_id }, { friend_id: user_id }]
      },
      attributes: ['user_id', 'friend_id']
    });

    // Lấy danh sách bạn bè của user B
    const bFriends = await Friend.findAll({
      where: {
        status: 'accepted',
        [Op.or]: [{ user_id: friend_id }, { friend_id: friend_id }]
      },
      attributes: ['user_id', 'friend_id']
    });

    // Hàm tách ra ID bạn bè
    const aSet = new Set(extractFriendIds(aFriends, user_id));
    const bSet = new Set(extractFriendIds(bFriends, friend_id));

    // Giao 2 tập hợp để tìm bạn chung
    const mutualIds = [...aSet].filter(id => bSet.has(id));

    if (mutualIds.length === 0) {
      return { error: { code: 200, message: "No mutual friends found" } };
    }

    // Lấy thông tin chi tiết các bạn chung
    const mutualFriends = await UserInfo.findAll({
      where: { id: { [Op.in]: mutualIds } },
      include: [{
        model: UserAccount,
        as: 'userAccount',
        attributes: ['user_name']
      }],
      attributes: ['id', 'full_name', 'avatar']
    });

    return { result: { mutualFriends }, count: mutualIds.length };
  },
  async getFriendsList(user_id) {
    const sent = await Friend.findAll({
      where: { user_id, status: 'accepted' },
      include: [{ model: UserInfo, as: 'Recipient', attributes: ['id', 'full_name', 'avatar'], include: [{
            model: UserAccount,
            as: 'userAccount',
            attributes: ['user_name']
          }] }]
    });

    const received = await Friend.findAll({
      where: { friend_id: user_id, status: 'accepted' },
      include: [
        { model: UserInfo, 
          as: 'Requester', 
          attributes: ['id', 'full_name', 'avatar'],
          include: [{
            model: UserAccount,
            as: 'userAccount',
            attributes: ['user_name']
          }]
        }
      ]
    });

    const friends = [
      ...sent.map(f => f.Recipient),
      ...received.map(f => f.Requester)
    ];

    return { result: friends };
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
        attributes: ['id', 'full_name', 'avatar'],
        include: [{
          model: UserAccount,
          as: 'userAccount',
          attributes: ['user_name']
        }]
      }],
    });

    return { result: { requests: sentRequests } };
  },

  async getReceivedRequests(user_id) {
    const receivedRequests = await Friend.findAll({
      where: { friend_id: user_id, status: 'pending' },
      include: [{
        model: UserInfo,
        as: 'Requester',
        attributes: ['id', 'full_name', 'avatar'],
        include: [{
          model: UserAccount,
          as: 'userAccount',
          attributes: ['user_name']
        }]
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

  async getFriendshipStatus(user_id, friend_id) {
    if (!friend_id || user_id === friend_id) {
      return { error: { code: 400, message: "Invalid user" } };
    }

    try {
      // Kiểm tra xem đã là bạn bè chưa
      const friendship = await Friend.findOne({
        where: {
          status: 'accepted',
          [Op.or]: [
            { user_id, friend_id },
            { user_id: friend_id, friend_id: user_id }
          ]
        }
      });

      if (friendship) {
        return { result: { status: 'friends' } };
      }

      // Kiểm tra xem có lời mời đang chờ không
      const sentRequest = await Friend.findOne({
        where: {
          user_id,
          friend_id,
          status: 'pending'
        }
      });

      if (sentRequest) {
        return { result: { status: 'pending' } };
      }

      // Kiểm tra xem có nhận được lời mời không
      const receivedRequest = await Friend.findOne({
        where: {
          user_id: friend_id,
          friend_id: user_id,
          status: 'pending'
        }
      });

      if (receivedRequest) {
        return { result: { status: 'received' } };
      }

      // Không có quan hệ gì
      return { result: { status: 'none' } };
    } catch (error) {
      return { error: { code: 500, message: "Server internal error" } };
    }
  },
  async getFriendSuggestions(user_id) {
    if (!user_id) {
      return { error: { code: 400, message: "user_id is required" } };
    }

    try {

      const directFriends = await Friend.findAll({
        where: {
          status: 'accepted',
          [Op.or]: [{ user_id }, { friend_id: user_id }]
        },
        attributes: ["user_id", "friend_id"]
      });
      const directFriendIds = directFriends.map(f =>
        f.user_id === user_id ? f.friend_id : f.user_id
      );


      const friendsOfFriends = await Friend.findAll({
        where: {
          status: 'accepted',
          [Op.or]: [
            { user_id: { [Op.in]: directFriendIds } },
            { friend_id: { [Op.in]: directFriendIds } }
          ]
        },
        attributes: ["user_id", "friend_id"]
      });
      const friendsOfFriendsIds = friendsOfFriends.map(f =>
        directFriendIds.includes(f.user_id) ? f.friend_id : f.user_id
      );

      const suggestedIds = [...new Set(friendsOfFriendsIds.filter(id =>
        id !== user_id && !directFriendIds.includes(id)
      ))];

      if (suggestedIds.length === 0) {
        return { result: [] };
      }

      const existingRelations = await Friend.findAll({
        where: {
          [Op.or]: [
            { user_id, friend_id: { [Op.in]: suggestedIds } },
            { friend_id: user_id, user_id: { [Op.in]: suggestedIds } }
          ]
        },
        attributes: ["user_id", "friend_id", "status"]
      });
      const excludedIds = new Set(existingRelations.map(r =>
        r.user_id === user_id ? r.friend_id : r.user_id
      ));

      const finalSuggestedIds = suggestedIds.filter(id => !excludedIds.has(id));

      if (finalSuggestedIds.length === 0) {
        return { result: [] };
      }

      const suggestedUsers = await UserInfo.findAll({
        where: { id: { [Op.in]: finalSuggestedIds } },
        include: [{
          model: UserAccount,
          as: 'userAccount',
          attributes: ['user_name']
        }],
        attributes: ["id", "full_name", "avatar"]
      });
      return { result: suggestedUsers };
    } catch (error) {
      return { error: { code: 500, message: "Internal server error", detail: error.message } };
    }
  }
};
