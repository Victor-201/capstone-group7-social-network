import profileService from "../services/Profile.service.js";

export const getProfile = async (req, res) => {
  const userId = req.user.id;

  const { error, result } = await profileService.getProfile(userId);
  if (error) return res.status(error.code).json(error);

  return res.status(200).json(result);
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const data = req.body;

  const { error, result } = await profileService.updateProfile(userId, data);
  if (error) return res.status(error.code).json(error);

  return res
    .status(200)
    .json({ message: "Profile updated successfully", profile: result });
};

export const updateProfileVisibility = async (req, res) => {
  const userId = req.user.id;
  const visibilities = req.body.visibilities;

  const { error, result } = await profileService.updateProfileVisibility(userId, visibilities);
  if (error) return res.status(error.code).json(error);

  return res
    .status(200)
    .json({ message: "Visibility settings updated successfully", visibilities: result });
};
