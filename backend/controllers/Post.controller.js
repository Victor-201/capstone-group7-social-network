import postService from '../services/post.service.js';

export const CreatePost = async (req, res) => {
  const { error, result } = await postService.createPost(req.user.id, req.body, req.files);
  if (error) return res.status(error.code).json(error);
  return res.status(201).json(result);
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
