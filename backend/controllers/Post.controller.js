import postService from '../services/post.service.js';

export const CreatePost = async (req, res) => {
  const { error, result } = await postService.createPost(req.user.id, req.body, req.files);
  if (error) return res.status(error.code).json(error);

  const { receiver_ids, action_id, action_type, content } = result.notifi || {};

  if (receiver_ids?.length > 0) {
    for (const receiver_id of receiver_ids) {
      const notification = await notificationService.createNotification(
        req.user.id,
        receiver_id,
        action_type,
        action_id,
        `${req.user.user_name} ${content}`
      );

      if (!notification.error) {
        req.io?.to(receiver_id).emit("newNotification", notification.result);
      }
    }
  }
  return res.status(201).json({ message: result.message, post: result.post });
};

export const GetPosts = async (req, res) => {
  const { error, result } = await postService.getPosts(req.user.id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const PostDetail = async (req, res) => {
  const { error, result } = await postService.getPostDetail(req.params.id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const editPost = async (req, res) => {
  const { error, result } = await postService.editPost(req.user.id, req.params.id, req.body);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const deletePost = async (req, res) => {
  const { error, result } = await postService.deletePost(req.user.id, req.params.id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const sharePost = async (req, res) => {
  const { error, result } = await postService.sharePost(req.user.id, req.params.id);
  if (error) return res.status(error.code).json(error);
  return res.status(201).json(result);
};
