import models from "../models/index.js";
import { sendMail } from "../helpers/sendMail.helper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { UserAccount } = models;

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * 1. Send OTP to user's email
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserAccount.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const otpCode = generateOtp();
    const hashedOtp = await bcrypt.hash(otpCode, 10);
    const otpExpiry = new Date(Date.now() + 60 * 1000); // OTP valid for 60 seconds

    await UserAccount.update(
      { otp_code: hashedOtp, otp_expiry: otpExpiry },
      { where: { id: user.id } }
    );

    await sendMail(email, "Reset your password", `Your OTP code is: ${otpCode}`);

    return res.status(200).json({ message: "OTP has been sent to your email" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 2. Verify OTP
 */
export const verifyOtpCode = async (req, res) => {
  const { email, otp_code } = req.body;

  try {
    const user = await UserAccount.findOne({ where: { email } });
    if (!user || !user.otp_code || !user.otp_expiry) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const isMatch = await bcrypt.compare(otp_code, user.otp_code);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const now = new Date();
    if (new Date(user.otp_expiry) < now) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    const resetToken = jwt.sign({ id: user.id, email: user.email }, process.env.RESET_PASSWORD_TOKEN_SECRET, { expiresIn: '30m' });
    return res.status(200).json({ message: "OTP verified successfully", resetToken: resetToken });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 3. Reset password
 */
export const resetPassword = async (req, res) => {
  const newPassword = req.body.newPassword;
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided!' });
  }

  try {
    const data = jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET);

    const user = await UserAccount.findOne({ where: { email: data.email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await UserAccount.update(
      { password: hashedPassword, otp_code: null, otp_expiry: null },
      { where: { id: user.id } }
    );

    return res.status(200).json({ message: "Password has been reset successfully" });

  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
