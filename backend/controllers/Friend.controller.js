import friendService from '../services/Friend.service.js';

export const sendFriendRequest = async (req, res) => {
  const { friend_id } = req.body;
  const user_id = req.user.id;

  const { error, result } = await friendService.sendFriendRequest(user_id, friend_id);
  if (error) return res.status(error.code).json(error);
  return res.status(201).json(result);
};

export const respondToFriendRequest = async (req, res) => {
  const { friend_id, status } = req.body;
  const user_id = req.user.id;

  const { error, result } = await friendService.respondToFriendRequest(user_id, friend_id, status);
  if (error) return res.status(error.code).json(error);
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
