import commentService from "../services/Comment.service.js";
import notificationService from "../services/Notification.service.js";


export const createComment = async (req, res) => {
  const post_id = req.params.id;
  const { content } = req.body;
  const user_id = req.user.id;
  const action_type = 'comment';
  const { error, result } = await commentService.createComment(post_id, user_id, content);
  if (error) return res.status(error.code).json({ message: error.message });
  const { receiver_id } = result;
  const notification = await notificationService.createNotification(
    user_id,
    receiver_id,
    action_type,
    post_id,
    content
  );
  if (!notification.error) {
    req.io?.to(receiver_id).emit("newNotification", notification.result);
  }
  return res.status(201).json(result);
};


export const replyToComment = async (req, res) => {
  const parent_comment_id = req.params.id;
  const { content } = req.body;
  const user_id = req.user.id;

  const { error, result } = await commentService.replyToComment(parent_comment_id, user_id, content);
  if (error) return res.status(error.code).json({ message: error.message });
  return res.status(201).json(result);
};

export const deleteComment = async (req, res) => {
  const comment_id = req.params.id;
  const user_id = req.user.id;

  const { error, result } = await commentService.deleteComment(comment_id, user_id);
  if (error) return res.status(error.code).json({ message: error.message });
  return res.status(200).json(result);
};
