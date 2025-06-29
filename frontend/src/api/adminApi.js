import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/admin`;

// Get all users
export const getAllUsers = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Lỗi khi lấy danh sách người dùng.");
    }

    const data = await response.json();

    // Kiểm tra cấu trúc dữ liệu trả về từ backend
    if (data && data.users) {
      return data.users; // Trả về trường users từ response
    }
    
    if (data && data.result && data.result.users) {
      return data.result.users; // Trả về trường users từ result
    }

    return Array.isArray(data) ? data : []; // Trả về mảng hoặc mảng rỗng
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
};

// Change user status
export const changeUserStatus = async (token, userId, status) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Lỗi khi cập nhật trạng thái người dùng.");
    }

    const data = await response.json();
    return data.result || data;
  } catch (error) {
    console.error("Error changing user status:", error);
    throw new Error("Error changing user status");
  }
};

// Get all posts
export const getAllPosts = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Lỗi khi lấy danh sách bài đăng.");
    }

    const data = await response.json();

    // Kiểm tra cấu trúc dữ liệu trả về từ backend
    if (data && data.posts) {
      return data.posts;
    }
    
    if (data && data.result && data.result.posts) {
      return data.result.posts;
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Error fetching posts");
  }
};

// Delete a post
export const deletePost = async (token, postId) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Lỗi khi xóa bài đăng.");
    }

    const data = await response.json();
    return data.result || data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Error deleting post");
  }
};

// Get system statistics
export const getSystemStats = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/system-stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Lỗi khi lấy thống kê hệ thống.");
    }

    const data = await response.json();
    return data.result || data;
  } catch (error) {
    console.error("Error fetching system stats:", error);
    throw new Error("Error fetching system stats");
  }
}; 