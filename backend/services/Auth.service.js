import sequelize from "../configs/database.config.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken
} from "../helpers/token.helper.js";
import models from "../models/index.js";
import { registationValidate, signInValidate } from "../validators/Auth.validator.js";
import { sendMail } from "../helpers/sendMail.helper.js";

const { UserAccount, UserInfo, RefreshToken } = models;

const MAX_REFRESH_TOKENS = 5;

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export default {
  async signUp(data) {
    const { error } = registationValidate.validate(data, { abortEarly: false });
    if (error) {
      return {
        error: {
          code: 400,
          name: error.name,
          message: error.details.map(e => e.message)
        }
      };
    }

    const [emailExists, usernameExists, phoneExists] = await Promise.all([
      UserAccount.findOne({ where: { email: data.email } }),
      UserAccount.findOne({ where: { user_name: data.user_name } }),
      UserAccount.findOne({ where: { phone_number: data.phone_number } })
    ]);

    if (emailExists || usernameExists || phoneExists) {
      return {
        error: {
          code: 400,
          name: "UserExists",
          message: "Email, username, or phone number already in use"
        }
      };
    }

    const hashed = await bcryptjs.hash(data.password, 10);

    await sequelize.transaction(async (t) => {
      const userInfo = await UserInfo.create({
        full_name: data.full_name,
        gender: data.gender,
        birth_date: data.birth_date
      }, { transaction: t });

      await UserAccount.create({
        id: userInfo.id,
        phone_number: data.phone_number,
        user_name: data.user_name,
        email: data.email,
        password: hashed
      }, { transaction: t });
    });

    return {
      result: {
        name: "UserCreated",
        message: "Account created successfully"
      }
    };
  },

  async signIn(data) {
    const { error } = signInValidate.validate(data, { abortEarly: false });
    if (error) {
      return {
        error: {
          code: 400,
          name: error.name,
          message: error.details.map(e => e.message)
        }
      };
    }

    const login_name = data.login_name.trim();
    let clause = {};
    if (/^\d{9,11}$/.test(login_name)) clause.phone_number = login_name;
    else if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(login_name)) clause.email = login_name;
    else clause.user_name = login_name;

    const user = await UserAccount.findOne({ where: clause });
    if (!user) {
      return {
        error: {
          code: 400,
          name: "UserNotFound",
          message: "Account does not exist"
        }
      };
    }

    const valid = await bcryptjs.compare(data.password, user.password);
    if (!valid) {
      return {
        error: {
          code: 400,
          name: "InvalidPassword",
          message: "Incorrect password"
        }
      };
    }

    const payload = {
      id: user.id,
      user_name: user.user_name,
      role: user.role,
      email: user.email
    };

    const accessToken = generateAccessToken(payload);
    const { token: refreshToken, expiresAt } = generateRefreshToken(payload);

    const userTokens = await RefreshToken.findAll({
      where: { user_id: user.id },
      order: [['created_at', 'ASC']]
    });

    if (userTokens.length >= MAX_REFRESH_TOKENS) {
      const tokensToDelete = userTokens.slice(0, userTokens.length - MAX_REFRESH_TOKENS + 1);
      const ids = tokensToDelete.map(t => t.id);
      await RefreshToken.destroy({ where: { id: ids } });
    }

    await RefreshToken.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: expiresAt
    });

    return {
      result: {
        name: "UserLoggedIn",
        message: "Logged in successfully",
        accessToken,
        refreshToken
      }
    };
  },

  async signOut(token) {
    if (!token) {
      return {
        error: {
          code: 400,
          name: "NoTokenProvided",
          message: "No token provided"
        }
      };
    }

    const deleted = await RefreshToken.destroy({ where: { token } });
    if (!deleted) {
      return {
        error: {
          code: 404,
          name: "TokenNotFound",
          message: "Invalid or already logged out token"
        }
      };
    }

    return {
      result: {
        name: "UserLoggedOut",
        message: "Logged out successfully"
      }
    };
  },

  async refreshToken(token) {
    if (!token) {
      return {
        error: {
          code: 403,
          name: "NoToken",
          message: "No refresh token provided"
        }
      };
    }

    const tokenRecord = await RefreshToken.findOne({ where: { token } });
    if (!tokenRecord) {
      return {
        error: {
          code: 403,
          name: "InvalidRefreshToken",
          message: "Invalid refresh token"
        }
      };
    }

    try {
      const data = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      const userInfo = await UserInfo.findByPk(data.id);
      if (!userInfo) {
        return {
          error: {
            code: 404,
            name: "UserNotFound",
            message: "Account does not exist"
          }
        };
      }

      const payload = {
        id: data.id,
        user_name: data.user_name,
        role: data.role,
        email: data.email
      };

      const accessToken = generateAccessToken(payload);

      return {
        result: {
          name: "AccessTokenGenerated",
          message: "Access token generated successfully",
          accessToken
        }
      };
    } catch (err) {
      return {
        error: {
          code: 401,
          name: "TokenExpired",
          message: "Token expired or invalid"
        }
      };
    }
  },

  async forgotPassword({ email }) {
    const user = await UserAccount.findOne({ where: { email } });
    if (!user) {
      return {
        error: {
          code: 404,
          name: "EmailNotFound",
          message: "Email does not exist"
        }
      };
    }

    const otpCode = generateOtp();
    const hashedOtp = await bcryptjs.hash(otpCode, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await UserAccount.update(
      { otp_code: hashedOtp, otp_expiry: otpExpiry },
      { where: { id: user.id } }
    );

    await sendMail(email, "Password recovery OTP", `Your OTP code is: ${otpCode}`);

    return {
      result: {
        name: "OtpSent",
        message: "OTP sent to email"
      }
    };
  },

  async verifyOtpCode({ email, otp_code }) {
    const user = await UserAccount.findOne({ where: { email } });
    if (!user || !user.otp_code || !user.otp_expiry) {
      return {
        error: {
          code: 400,
          name: "InvalidRequest",
          message: "Invalid request data"
        }
      };
    }

    const isMatch = await bcryptjs.compare(otp_code, user.otp_code);
    if (!isMatch) {
      return {
        error: {
          code: 400,
          name: "InvalidOtp",
          message: "Invalid OTP code"
        }
      };
    }

    if (new Date(user.otp_expiry) < new Date()) {
      return {
        error: {
          code: 400,
          name: "OtpExpired",
          message: "OTP code has expired"
        }
      };
    }

    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.RESET_PASSWORD_TOKEN_SECRET,
      { expiresIn: "30m" }
    );

    return {
      result: {
        name: "OtpVerified",
        message: "OTP verified successfully",
        resetToken
      }
    };
  },

  async resetPassword(new_password, token) {
    if (!token) {
      return {
        error: {
          code: 401,
          name: "NoToken",
          message: "No token provided"
        }
      };
    }

    try {
      const data = jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET);
      const user = await UserAccount.findOne({ where: { email: data.email } });
      if (!user) {
        return {
          error: {
            code: 404,
            name: "UserNotFound",
            message: "Account does not exist"
          }
        };
      }

      const hashedPassword = await bcryptjs.hash(new_password, 10);
      await UserAccount.update(
        { password: hashedPassword, otp_code: null, otp_expiry: null },
        { where: { id: user.id } }
      );

      return {
        result: {
          name: "PasswordReset",
          message: "Password changed successfully"
        }
      };
    } catch (err) {
      return {
        error: {
          code: 401,
          name: "InvalidToken",
          message: "Token is invalid or expired"
        }
      };
    }
  }
};