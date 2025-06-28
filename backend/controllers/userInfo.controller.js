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
  const { error, result } = await userInfoService.getUserInfoByIdS(id);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const updateProfile = async (req, res) => {
  const { error, result } = await userInfoService.updateProfile(req.user.id, req.body);
  if (error) {
    return res.status(error.code).json(error);
  }
  return res.status(200).json(result);
};

export const updateProfileVisibility = async (req, res) => {
  const { error, result } = await userInfoService.updateProfileVisibility(req.user.id, req.body);
  if (error) {
    return res.status(error.code).json(error);
  }
  return res.status(200).json(result);
};

export const getUserInfoByUserName = async (req, res) => {
  const user_name = req.params.user_name;
  const { error, result } = await userInfoService.getUserByUserName(user_name);
  if(error){
    return res.status(error.code).json(error);
  }
  return res.status(200).json(result);
}