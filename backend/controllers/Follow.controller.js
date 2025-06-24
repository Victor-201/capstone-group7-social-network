import followService from '../services/Follow.service.js';
import notify from '../helpers/notification.helper.js';

export const FollowUser = async (req, res) => {
  const follower_id = req.user.id;
  const following_id = req.params.id;
  const action_type = "follow";
  const { error, result } = await followService.followUser(follower_id, following_id);
  if (error) return res.status(error.code).json(error);
  const action_id = result.id;
  
  const notifyResult = await notify(follower_id,following_id,action_type,action_id, `${req.user.user_name} started follow you`);
  if (notifyResult?.error) {
      console.error("Send notification failed:", notifyResult.error);
  }
  return res.status(201).json({ message: 'Followed successfully', follow: result });
};

export const UnfollowUser = async (req, res) => {
  const follower_id = req.user.id;
  const following_id = req.params.id;

  const { error, result } = await followService.unfollowUser(follower_id, following_id);

  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const getFollowers = async (req, res) => {
  const { userId } = req.query;
  const user_id = userId || req.user.id;

  const { error, result } = await followService.getFollowers(user_id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const getFollowing = async (req, res) => {
  const { userId } = req.query;
  const user_id = userId || req.user.id;

  const { error, result } = await followService.getFollowing(user_id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const getFollowStatus = async (req, res) => {
  const follower_id = req.user.id;
  const following_id = req.params.id;

  const { error, result } = await followService.getFollowStatus(follower_id, following_id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};
