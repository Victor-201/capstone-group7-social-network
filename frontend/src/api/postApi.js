import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/post`;

// Tạo bài viết mới
export const createPost = async (token, postData) => {
    const response = await fetch(`${BASE_URL}/create`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Lấy tất cả bài viết
export const getAllPosts = async (token, page = 1, limit = 10) => {
    const response = await fetch(`${BASE_URL}/all?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Lấy bài viết theo ID
export const getPostById = async (token, postId) => {
    const response = await fetch(`${BASE_URL}/${postId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Lấy bài viết của user
export const getUserPosts = async (token, userId, page = 1, limit = 10) => {
    const response = await fetch(`${BASE_URL}/user/${userId}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Cập nhật bài viết
export const updatePost = async (token, postId, postData) => {
    const response = await fetch(`${BASE_URL}/update/${postId}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Xóa bài viết
export const deletePost = async (token, postId) => {
    const response = await fetch(`${BASE_URL}/delete/${postId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Lấy bài viết trên newsfeed
export const getNewsfeed = async (token, page = 1, limit = 10) => {
    const response = await fetch(`${BASE_URL}/newsfeed?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Upload ảnh cho bài viết
export const uploadPostMedia = async (token, formData) => {
    const response = await fetch(`${BASE_URL}/upload-media`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};
