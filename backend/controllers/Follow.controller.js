import followService from '../services/Follow.service.js';

export const FollowUser = async (req, res) => {
  const follower_id = req.user.id;
  const following_id = req.params.id;

  const { error, result } = await followService.followUser(follower_id, following_id);

  if (error) return res.status(error.code).json(error);
  return res.status(201).json({ message: 'Followed successfully', follow: result });
};

export const UnfollowUser = async (req, res) => {
  const follower_id = req.user.id;
  const following_id = req.params.id;

  const { error, result } = await followService.unfollowUser(follower_id, following_id);

  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};
