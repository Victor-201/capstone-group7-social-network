import models from "../models/index.js";
const { UserInfo, UserAccount } = models;

export default {
  async getUserInfo(user_id) {
    try {
      const user = await UserInfo.findOne({
        where: { id: user_id },
        include: [
          {
            model: UserAccount,
            as: "userAccount",
            attributes: ["email", "phone_number", "user_name", "created_at"]
          }
        ],
        attributes: [
          "id",
          "full_name",
          "avatar",
          "cover",
          "isOnline",
          'birth_date',
          "gender",
          "bio",
        ]
      });

      if (!user) {
        return { error: { code: 404, message: "User not found" } };
      }

      return { result: user };
    } catch (err) {
      return {
        error: { code: 500, message: "Server error", detail: err.message }
      };
    }
  },

  async updateUserInfo(user_id, info) {
    try {
      const user = await UserInfo.findOne({ where: { id: user_id } });

      if (!user) {
        return { error: { code: 404, message: "User not found" } };
      }

      await UserInfo.update(
        {
          full_name: info.full_name,
          birth_date: info.birth_date,
          gender: info.gender,
          bio: info.bio,
        },
        {
          where: { id: user_id }
        }
      );

      return { result: { message: "User info updated successfully" } };
    } catch (err) {
      return {
        error: { code: 500, message: "Server error", detail: err.message }
      };
    }
  },

  async getUserInfoById(id) {
    try {
      const userInfo = await UserInfo.findOne({
        where: { id },
        include: [
          {
            model: UserAccount,
            as: "userAccount",
            attributes: ["email", "phone_number", "user_name", "created_at"]
          }
        ],
        attributes: [
          "id",
          "full_name",
          "avatar",
          "cover",
          "isOnline",
          "birth_date",
          "gender",
          "bio",
        ]
      });

      if (!userInfo) {
        return { error: { code: 404, message: "User not found" } };
      }

      return { result: userInfo };
    } catch (err) {
      return {
        error: { code: 500, message: "Server error", detail: err.message }
      };
    }
  }
};
