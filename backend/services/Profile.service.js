import model from "../models/index.js";
import { updateProfileSchema } from "../validators/Profile.validator.js";

const { ProfileDetail, ProfileVisible } = model;

const getProfile = async (userId) => {
  try {
    const profile = await ProfileDetail.findOne({
      where: { user_id: userId },
      include: [{ model: ProfileVisible }]
    });
    if (!profile) {
      return { error: { code: 404, message: "Profile not found" } };
    }
    return { result: profile };
  } catch (error) {
    return { error: { code: 500, message: error.message } };
  }
};

const updateProfile = async (userId, data) => {
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
};

const updateProfileVisibility = async (userId, visibilities) => {
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
};

export default {
  getProfile,
  updateProfile,
  updateProfileVisibility,
};
