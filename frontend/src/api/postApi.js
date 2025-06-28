import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/user`;

// Tạo bài viết mới
export const createPost = async (token, formData) => {
    const response = await fetch(`${BASE_URL}/post`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData, // multipart/form-data, KHÔNG set Content-Type
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

export const updatePost = async (token, post_id, formData) => {
    const response = await fetch(`${BASE_URL}/posts/${post_id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData, // multipart/form-data, KHÔNG set Content-Type
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

/**
 * Lấy bài viết theo userId (nếu có), hoặc của chính người dùng
 */
export const fetchUserPosts = async (token) => {

  const response = await fetch(`${BASE_URL}/posts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lỗi khi lấy bài viết.");
  }

  return data;
};
export const fetchFeedPost = async (token) => {

  const response = await fetch(`${BASE_URL}/posts/feed`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lỗi khi lấy bài viết.");
  }

  return data;
};