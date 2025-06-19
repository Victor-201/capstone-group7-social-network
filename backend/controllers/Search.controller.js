import searchService from '../services/Search.service.js';

export const searchUsers = async (req, res) => {
  const { q } = req.query;
  const { error, result } = await searchService.searchUsers(q);

  if (error) return res.status(error.code).json({ error: error.message });
  return res.status(200).json(result);
};

export const searchPosts = async (req, res) => {
  const { q } = req.query;
  const { error, result } = await searchService.searchPosts(q);

  if (error) return res.status(error.code).json({ error: error.message });
  return res.status(200).json(result);
};
