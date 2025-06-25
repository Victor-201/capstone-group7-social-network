import LikeService from "../services/Like.service.js";
import notify from "../helpers/notification.helper.js";


export const likeOrUnlike = async (req, res) => {
  const isLike = req.params.isLike === 'true';
  const user_id = req.user.id;
  const post_id = req.params.id;

  if (isLike) {
    const { error, result } = await LikeService.likePost(user_id, post_id);
    if (error) return res.status(error.code).json(error);

    if (result?.notify) {
      const { receiver_id, action_type, action_id, content } = result.notify;

      const notifyResult = await notify(user_id, receiver_id, action_type, action_id, `${content}`);
      if (notifyResult?.error) {
        console.error("Send notification failed:", notifyResult.error);
      }
    }

    return res.status(201).json({ message: result?.message || "Post liked successfully" });
  } else {
    const { error, result } = await LikeService.unlikePost(user_id, post_id);
    if (error) return res.status(error.code).json(error);

    return res.status(200).json({ message: result?.message || "Post unliked successfully" });
  }
};


export const postLiked = async (req, res) => {
  const user_id = req.user.id;
  const { result, error } = await LikeService.postLiked(user_id);
  if (error) return res.status(error.code).json(error);

  return res.status(200).json({ data: result });
}