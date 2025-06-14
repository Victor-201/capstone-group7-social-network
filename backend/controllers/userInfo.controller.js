import userInfoService from "../services/userInfo.service.js";

export const getUserInfo = async (req, res) => {
  const { error, result } = await userInfoService.getUserInfo(req.user.id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const updateUserInfo = async (req, res) => {
  const { error, result } = await userInfoService.updateUserInfo(req.user.id, req.body);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const getUserInfoById = async (req, res) => {
  const { id } = req.params;
  const { error, result } = await userInfoService.getUserInfoById(id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};
