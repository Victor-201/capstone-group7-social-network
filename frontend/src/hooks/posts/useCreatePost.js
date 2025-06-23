import { useState } from "react";
import { createPost } from "../../api/postApi";

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const createPostWithMedia = async (postData, mediaFiles = []) => {
    const formData = new FormData();
    formData.append("content", postData.content);
    formData.append("access_modifier", postData.access_modifier); // ✅ THÊM access_modifier

    mediaFiles.forEach((file) => {
      formData.append("media", file);
    });

    setLoading(true);
    setUploadProgress(0);
    setError(null);

    try {
      console.log("Đang gửi post:", postData);
      await createPost(token, formData);
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi đăng bài.");
      throw err;
    } finally {
      setLoading(false);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return {
    createPostWithMedia,
    loading,
    error,
    uploadProgress,
  };
};
