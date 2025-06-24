import friendService from '../services/Friend.service.js';
import notificationService from '../services/Notification.service.js';

export const sendFriendRequest = async (req, res) => {
  const { friend_id } = req.body;
  const user_id = req.user.id;
  const action_type = 'friend_request';

  const { error, result } = await friendService.sendFriendRequest(user_id, friend_id);
  if (error) return res.status(error.code).json(error);

  const action_id = result.friend.id;
  const content = `${req.user.user_name} sent you a friend request`;
  const notification = await notificationService.createNotification(
    user_id,
    friend_id,
    action_type,
    action_id,
    content
  );
  if (!notification.error) {
    req.io?.to(friend_id).emit("newNotification", notification.result);
  }
  return res.status(201).json(result);
};

export const respondToFriendRequest = async (req, res) => {
  const { friend_id, status } = req.body;
  const user_id = req.user.id;
  const action_type = "friend_respond";
  const { error, result } = await friendService.respondToFriendRequest(user_id, friend_id, status);
  if (error) return res.status(error.code).json(error);

  if (result.notify) {
    const { sendTo, action_id, content } = result.notify;

    const notification = await notificationService.createNotification(
      user_id,
      sendTo,
      action_type,
      action_id,
      `${req.user.user_name} ${content}`
    );
    if (!notification.error) {
      req.io?.to(sendTo).emit("newNotification", notification.result);
    }
  }
  return res.status(200).json(result);
};


export const getMutualFriends = async (req, res) => {
  const friend_id = req.params.friend_id;
  const user_id = req.user.id;

  const { error, result } = await friendService.getMutualFriends(user_id, friend_id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const getFriendsList = async (req, res) => {
  const user_id = req.user.id;

  const { error, result } = await friendService.getFriendsList(user_id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const deleteFriend = async (req, res) => {
  const friend_id = req.params.friend_id;
  const user_id = req.user.id;

  const { error, result } = await friendService.deleteFriend(user_id, friend_id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const getSentRequests = async (req, res) => {
  const user_id = req.user.id;

  const { error, result } = await friendService.getSentRequests(user_id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const getReceivedRequests = async (req, res) => {
  const user_id = req.user.id;

  const { error, result } = await friendService.getReceivedRequests(user_id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};
