import LikeService from "../services/Like.service.js";
import notificationService from "../services/Notification.service.js";

export const likePost = async (req, res) => {
  const user_id = req.user.id;
  const post_id = req.params.id;
  console.log(post_id);
  const { error, result } = await LikeService.likePost(user_id, post_id);
  if (error) return res.status(error.code).json(error);

  if (result.notify) {
    const { receiver_id, action_type, action_id, content } = result.notify;
    const notification = await notificationService.createNotification(
      user_id,
      receiver_id,
      action_type,
      action_id,
      `${req.user.user_name} ${content}`
    );
    console.log(receiver_id);
    if (!notification.error) {
      req.io?.to(receiver_id).emit("newNotification", notification.result);
      console.log('Emitting notification to room');
    }
  }
  return res.status(201).json({ message: result.message });
};


export const unlikePost = async (req, res) => {
  const user_id = req.user.id;
  const post_id = req.params.id;

  const { error, result } = await LikeService.unlikePost(user_id, post_id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json({ message: result });
};

// combine like and unlike
export const likeOrUnlike = async (req, res) => {
  const isLike = req.params.isLike === 'true';
  const user_id = req.user.id;
  const post_id = req.params.id;

  if (isLike) {
    const { error, result } = await LikeService.likePost(user_id, post_id);
    if (error) return res.status(error.code).json(error);

    if (result?.notify) {
      const { receiver_id, action_type, action_id, content } = result.notify;

      const notification = await notificationService.createNotification(
        user_id,
        receiver_id,
        action_type,
        action_id,
        `${req.user.user_name} ${content}`
      );
      if (!notification.error) {
        req.io?.to(receiver_id).emit("newNotification", notification.result);
      } else {
        console.error("Notification error:", notification.error);
      }
    }

    return res
      .status(201)
      .json({ message: result?.message || "Post liked successfully", isLike: true });
  } else {
    const { error, result } = await LikeService.unlikePost(user_id, post_id);
    if (error) return res.status(error.code).json(error);

    return res
      .status(200)
      .json({ message: result?.message || "Post unliked successfully", isLike: false });
  }
};
