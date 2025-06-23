import models from "../models/index.js";
import { updateProfileSchema } from "../validators/Profile.validator.js";

const {
  UserInfo,
  UserAccount,
  ProfileDetail,
  ProfileVisible,
  sequelize,
} = models;

export default {
  /**
   * Lấy thông tin người dùng + chi tiết profile + các field hiển thị (is_visible = true).
   */
  async getUserInfo(user_id) {
    if (!user_id) {
      return { error: { code: 400, message: "user_id is required" } };
    }

    try {
      const user = await UserInfo.findOne({
        where: { id: user_id },
        include: [
          {
            model: UserAccount,
            as: "userAccount",
            attributes: ["email", "phone_number", "user_name", "created_at"],
          },
          {
            model: ProfileDetail,
            as: "ProfileDetails",
            include: [
              {
                model: ProfileVisible,
                as: "visibleFields",
                where: { is_visible: true },
                required: false,
              },
            ],
          },
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
        ],
      });

      if (!user) {
        return { error: { code: 404, message: "User not found" } };
      }

      return { result: user };
    } catch (err) {
      return {
        error: { code: 500, message: "Server error", detail: err.message },
      };
    }
  },

  /**
   * Cập nhật thông tin cơ bản của user.
   */
  async updateUserInfo(user_id, info) {
    if (!user_id) {
      return { error: { code: 400, message: "user_id is required" } };
    }

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
          where: { id: user_id },
        }
      );

      return { result: { message: "User info updated successfully" } };
    } catch (err) {
      return {
        error: { code: 500, message: "Server error", detail: err.message },
      };
    }
  },

  /**
   * Lấy thông tin user theo id (tương tự getUserInfo).
   */
  async getUserInfoById(id) {
    if (!id) {
      return { error: { code: 400, message: "id is required" } };
    }

    try {
      const user = await UserInfo.findOne({
        where: { id },
        include: [
          {
            model: UserAccount,
            as: "userAccount",
            attributes: ["email", "phone_number", "user_name", "created_at"],
          },
          {
            model: ProfileDetail,
            as: "ProfileDetails",
            include: [
              {
                model: ProfileVisible,
                as: "visibleFields",
                where: { is_visible: true },
                required: false,
              },
            ],
          },
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
        ],
      });

      if (!user) {
        return { error: { code: 404, message: "User not found" } };
      }

      return { result: user };
    } catch (err) {
      return {
        error: { code: 500, message: "Server error", detail: err.message },
      };
    }
  },
  async updateProfile(userId, data) {
    try {
      const { error } = updateProfileSchema.validate(data);
      if (error) {
        return {
          error: {
            code: 400,
            name: error.name,
            message: error.details.map((e) => e.message),
          },
        };
      }
      const profile = await ProfileDetail.findOne({ where: { user_id: userId } });
      if (!profile) {
        return { error: { code: 404, message: "Profile not found" } };
      }
      await profile.update(data);
      return { result: profile };
    } catch (error) {
      return { error: { code: 500, message: error.message } };
    }
  },
  async updateProfileVisibility(userId, visibilities) {
    try {
      const profile = await ProfileDetail.findOne({ where: { user_id: userId } });
      if (!profile) {
        return { error: { code: 404, message: "Profile not found" } };
      }

      const results = [];
      for (const v of visibilities) {
        const { field_name, is_visible } = v;

        const result = await ProfileVisible.upsert({
          profile_detail_id: profile.id,
          field_name,
          is_visible,
        });
        results.push(result);
      }

      return { result: results };
    } catch (error) {
      return { error: { code: 500, message: error.message } };
    }
  }
};