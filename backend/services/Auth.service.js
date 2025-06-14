import sequelize from "../configs/database.config.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import models from "../models/index.js";
import registationValidate from "../validation/Registation.validation.js";
import signInValidate from "../validation/signIn.validation.js";
import { sendMail } from "../helpers/sendMail.helper.js";
import dotenv from "dotenv";

dotenv.config();

const { UserAccount, UserInfo, RefreshToken } = models;

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export default {
  async signUp(data) {
    const { error } = registationValidate.validate(data, { abortEarly: false });
    if (error) {
      return { error: { code: 400, name: error.name, message: error.details.map(e => e.message) } };
    }

    const exists = await UserAccount.findOne({ where: { email: data.email, user_name: data.userName, phone_number: data.phoneNumber } });
    if (exists) {
      return { error: { code: 400, name: "UserExist", message: "User already exists" } };
    }

    const hashed = await bcryptjs.hash(data.password, 10);

    await sequelize.transaction(async (t) => {
      const userInfo = await UserInfo.create({
        full_name: data.fullName,
        gender: data.gender,
        birth_date: data.birthdate
      }, { transaction: t });

      await UserAccount.create({
        id: userInfo.id,
        phone_number: data.phoneNumber,
        user_name: data.userName,
        email: data.email,
        password: hashed
      }, { transaction: t });
    });

    return {
      result: {
        name: "UserCreated",
        message: "User created successfully"
      }
    };
  },

  async signIn(data) {
    const { error } = signInValidate.validate(data, { abortEarly: false });
    if (error) {
      return { error: { code: 400, name: error.name, message: error.details.map(e => e.message) } };
    }

    const loginName = data.loginName.trim();
    let clause = {};
    if (/^\d{9,11}$/.test(loginName)) clause.phone_number = loginName;
    else if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(loginName)) clause.email = loginName;
    else clause.user_name = loginName;

    const user = await UserAccount.findOne({ where: clause });
    if (!user) {
      return { error: { code: 400, name: "UserNotFound", message: "User not found" } };
    }

    const valid = await bcryptjs.compare(data.password, user.password);
    if (!valid) {
      return { error: { code: 400, name: "InvalidPassword", message: "Invalid password" } };
    }

    const payload = {
      id: user.id,
      userName: user.user_name,
      role: user.role,
      email: user.email
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

    const expiresAt = new Date(jwt.decode(refreshToken).exp * 1000);

    await RefreshToken.create({ user_id: user.id, token: refreshToken, expires_at: expiresAt });

    return {
      result: {
        name: "UserLoggedIn",
        message: "Login successful",
        accessToken,
        refreshToken
      }
    };
  },

  async signOut(token) {
    if (!token) {
      return { error: { code: 400, name: "NoTokenProvided", message: "No token provided" } };
    }
    const deleted = await RefreshToken.destroy({ where: { token } });
    if (!deleted) {
      return { error: { code: 404, name: "TokenNotFound", message: "Token not found or already logged out" } };
    }
    return { result: { name: "UserLoggedOut", message: "Logout successful" } };
  },

  async refreshToken(token) {
    if (!token) {
      return { error: { code: 403, name: "NoToken", message: "No token provided!" } };
    }

    const tokenRecord = await RefreshToken.findOne({ where: { token } });
    if (!tokenRecord) {
      return { error: { code: 403, name: "InvalidRefreshToken", message: "Invalid refresh token!" } };
    }

    try {
      const data = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      const userInfo = await UserInfo.findByPk(data.id);
      if (!userInfo) {
        return { error: { code: 404, name: "UserNotFound", message: "User not found!" } };
      }

      const payload = {
        id: data.id,
        userName: data.userName,
        role: data.role,
        email: data.email,
      };

      const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      });

      return {
        result: {
          name: "AccessTokenGenerated",
          message: "Access token generated successfully",
          accessToken: newAccessToken
        }
      };
    } catch (err) {
      return { error: { code: 401, name: "TokenExpired", message: "Unauthorized or token expired!" } };
    }
  },

  async forgotPassword(data) {
    const { email } = data;
    const user = await UserAccount.findOne({ where: { email } });
    if (!user) {
      return { error: { code: 404, name: "EmailNotFound", message: "Email not found" } };
    }

    const otpCode = generateOtp();
    const hashedOtp = await bcryptjs.hash(otpCode, 10);
    const otpExpiry = new Date(Date.now() + 60 * 1000); // 1 minute

    await UserAccount.update({ otp_code: hashedOtp, otp_expiry: otpExpiry }, { where: { id: user.id } });

    await sendMail(email, "Reset your password", `Your OTP code is: ${otpCode}`);

    return {
      result: {
        name: "OtpSent",
        message: "OTP has been sent to your email"
      }
    };
  },

  async verifyOtpCode(data) {
    const { email, otp_code } = data;

    const user = await UserAccount.findOne({ where: { email } });
    if (!user || !user.otp_code || !user.otp_expiry) {
      return { error: { code: 400, name: "InvalidRequest", message: "Invalid request" } };
    }

    const isMatch = await bcryptjs.compare(otp_code, user.otp_code);
    if (!isMatch) {
      return { error: { code: 400, name: "InvalidOtp", message: "Invalid OTP" } };
    }

    const now = new Date();
    if (new Date(user.otp_expiry) < now) {
      return { error: { code: 400, name: "OtpExpired", message: "OTP has expired" } };
    }

    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.RESET_PASSWORD_TOKEN_SECRET,
      { expiresIn: '30m' }
    );

    return {
      result: {
        name: "OtpVerified",
        message: "OTP verified successfully",
        resetToken
      }
    };
  },

  async resetPassword(newPassword, token) {
    if (!token) {
      return { error: { code: 401, name: "NoToken", message: "No token provided!" } };
    }

    try {
      const data = jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET);

      const user = await UserAccount.findOne({ where: { email: data.email } });
      if (!user) {
        return { error: { code: 404, name: "UserNotFound", message: "User not found" } };
      }

      const hashedPassword = await bcryptjs.hash(newPassword, 10);

      await UserAccount.update(
        { password: hashedPassword, otp_code: null, otp_expiry: null },
        { where: { id: user.id } }
      );

      return {
        result: {
          name: "PasswordReset",
          message: "Password has been reset successfully"
        }
      };
    } catch (err) {
      return { error: { code: 401, name: "InvalidToken", message: "Invalid or expired token" } };
    }
  }
};
