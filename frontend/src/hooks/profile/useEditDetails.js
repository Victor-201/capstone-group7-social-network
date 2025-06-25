import { useState } from "react";
import { updateUserProfile, updateProfileVisibility, getUserInfo } from "../../api/userApi";

export const useEditDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveProfileDetails = async (token, userId, details, refe) => {
    setLoading(true);
    setError(null);

    const profileData = {
      job: details.job.value,
      education: details.education.value,
      location: details.location.value,
      hometown: details.hometown.value,
      relationship_status: details.relationship_status.value,
    };

    const visibleFields = Object.keys(details).map((key) => ({
      field_name: key,
      is_visible: details[key].is_visible,
    }));

    try {
      console.log("🔧 Gửi updateUserProfile:", profileData);
      await updateUserProfile(token, profileData);
      console.log("✅ Đã cập nhật profile");

      await updateProfileVisibility(token, visibleFields);
      console.log("✅ Đã cập nhật visibility");

      const updatedUser = await getUserInfo(token); // ⬅️ Gọi refetch tại đây
      return { success: true, userInfo: updatedUser };
    } catch (err) {
      console.error("❌ Lỗi khi lưu thông tin:", err);
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    saveProfileDetails,
    loading,
    error,
  };
};
