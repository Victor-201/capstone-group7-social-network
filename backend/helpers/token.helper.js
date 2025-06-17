import jwt from 'jsonwebtoken';
import ms from 'ms';
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  RESET_PASSWORD_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
} from "../configs/env.config.js";


if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET || !RESET_PASSWORD_TOKEN_SECRET) {
  throw new Error("Missing required token secrets in environment variables.");
}

const signToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, { expiresIn });

const calculateExpiryDate = (duration) => new Date(Date.now() + ms(duration));

export const generateAccessToken = (payload) =>
  signToken(payload, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES_IN);

export const generateRefreshToken = (payload) => {
  const token = signToken(payload, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN);
  const expiresAt = calculateExpiryDate(REFRESH_TOKEN_EXPIRES_IN);
  return { token, expiresAt };
};

export const generateResetToken = (payload) =>
  signToken(payload, RESET_PASSWORD_TOKEN_SECRET, '30m');