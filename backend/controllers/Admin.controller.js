import adminService from '../services/Admin.service.js';

export const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const { error, result } = await adminService.getAllUsers({
    page: parseInt(page),
    limit: parseInt(limit),
  });

  if (error) return res.status(error.code || 500).json({ message: error.message });
  return res.status(200).json(result);
};

export const changeUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const { error, result } = await adminService.changeUserStatus(id, status);

  if (error) return res.status(error.code || 500).json({ message: error.message });
  return res.status(200).json(result);
};

export const getAllPosts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const { error, result } = await adminService.getAllPosts({
    page: parseInt(page),
    limit: parseInt(limit),
  });

  if (error) return res.status(error.code || 500).json({ message: error.message });
  return res.status(200).json(result);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    const { error, result } = await adminService.deletePost(id);
    if (error) return res.status(error.code || 500).json({ message: error.message });
    return res.status(200).json(result);
}

export const getSystemStats = async (req, res) => {
  const { error, result } = await adminService.getSystemStats();

  if (error) return res.status(error.code || 500).json({ message: error.message });
  return res.status(200).json(result);
}