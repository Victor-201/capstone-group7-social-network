import authService from "../services/Auth.service.js";

export const signUp = async (req, res) => {
  const { error, result } = await authService.signUp(req.body);
  if (error) return res.status(error.code).json(error);
  return res.status(201).json(result);
};

export const signIn = async (req, res) => {
  const { error, result } = await authService.signIn(req.body);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const signOut = async (req, res) => {
  const { error, result } = await authService.signOut(req.body.refreshToken);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const refreshToken = async (req, res) => {
  const { error, result } = await authService.refreshToken(req.body.refreshToken);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const forgotPassword = async (req, res) => {
  const { error, result } = await authService.forgotPassword(req.body);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const verifyOtpCode = async (req, res) => {
  const { error, result } = await authService.verifyOtpCode(req.body);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};

export const resetPassword = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const { error, result } = await authService.resetPassword(req.body.newPassword, token);
  if (error) return res.status(error.code).json(error);
  return res.status(200).json(result);
};