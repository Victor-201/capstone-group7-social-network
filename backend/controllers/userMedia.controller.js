import userMediaService from '../services/userMedia.service.js';

export const getPhotosById = async (req, res) => {
  const { id } = req.params;
  const { error, result } = await userMediaService.getPhotosById(id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const getVideosById = async (req, res) => {
  const { id } = req.params;
  const { error, result } = await userMediaService.getVideosById(id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const deleteMediaById = async (req, res) => {
  const { id } = req.params;
  const { error, result } = await userMediaService.deleteMediaById(id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const uploadAvatar = async (req, res) => {
    const { file } = req;
    const { error, result } = await userMediaService.uploadAvatar(file, req.user.id, 'avatar');
    if (error) return res.status(error.code).json(error);
    return res.status(200).json(result);
}

export const uploadCover = async (req, res) => {
    const { file } = req;
    const { error, result } = await userMediaService.uploadCover(file, req.user.id, 'cover');
    if (error) return res.status(error.code).json(error);
    return res.status(200).json(result);
};