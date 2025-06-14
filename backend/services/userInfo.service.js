import models from "../models/index.js";
const { UserInfo } = models;

export default {
  async getUserInfo(userId) {
    try {
      const user = await UserInfo.findOne({
        where: { id: userId },
        attributes: [
          "id",
          "full_name",
          "bio",
          "gender",
          "birth_date",
          "location",
          "hometown",
          "avatar",
          "cover",
          "isOnline",
          "interestedUser"
        ]
      });
      if (!user) return { error: { code: 404, message: "User not found" } };
      return { result: user };
    } catch (err) {
      return { error: { code: 500, message: "Server error", detail: err.message } };
    }
  },

  async updateUserInfo(userId, info) {
    try {
      const user = await UserInfo.findOne({ where: { id: userId } });
      if (!user) return { error: { code: 404, message: "User not found" } };

      await UserInfo.update({
        full_name: info.fullName,
        bio: info.bio,
        gender: info.gender,
        birth_date: info.birthDate,
        location: info.location,
        hometown: info.hometown
      }, {
        where: { id: userId }
      });

      return { result: { message: "User info updated successfully" } };
    } catch (err) {
      return { error: { code: 500, message: "Server error", detail: err.message } };
    }
  },

  async getUserInfoById(id) {
    try {
      const userInfo = await UserInfo.findOne({
        where: { id },
        attributes: [
          "id",
          "full_name",
          "bio",
          "gender",
          "birth_date",
          "location",
          "hometown",
          "avatar",
          "cover",
          "isOnline",
          "interestedUser"
        ]
      });
      if (!userInfo) return { error: { code: 404, message: "User not found" } };
      return { result: userInfo };
    } catch (err) {
      return { error: { code: 500, message: "Server error", detail: err.message } };
    }
  }
};
