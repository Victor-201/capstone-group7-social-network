import followService from '../services/Follow.service.js';
import notificationService from '../services/Notification.service.js';

export const FollowUser = async (req, res) => {
  const follower_id = req.user.id;
  const following_id = req.params.id;
  const action_type = "follow";
  const { error, result } = await followService.followUser(follower_id, following_id);
  if (error) return res.status(error.code).json(error);
  const action_id = result.id;
  const notification = await notificationService.createNotification(follower_id,following_id,action_type,action_id, `${req.user.user_name} started follow you`);
  if (!notification.error) {
    req.io?.to(following_id).emit("newNotification", notification.result);
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
