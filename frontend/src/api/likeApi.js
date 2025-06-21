import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/like`;

// Like/Unlike bài viết
export const togglePostLike = async (token, postId) => {
    const response = await fetch(`${BASE_URL}/post`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Like/Unlike comment
export const toggleCommentLike = async (token, commentId) => {
    const response = await fetch(`${BASE_URL}/comment`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Lấy danh sách người like bài viết
export const getPostLikes = async (token, postId, page = 1, limit = 10) => {
    const response = await fetch(`${BASE_URL}/post/${postId}?page=${page}&limit=${limit}`, {
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

// Lấy danh sách người like comment
export const getCommentLikes = async (token, commentId, page = 1, limit = 10) => {
    const response = await fetch(`${BASE_URL}/comment/${commentId}?page=${page}&limit=${limit}`, {
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

// Kiểm tra user đã like bài viết chưa
export const checkPostLikeStatus = async (token, postId) => {
    const response = await fetch(`${BASE_URL}/post/${postId}/status`, {
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

// Kiểm tra user đã like comment chưa
export const checkCommentLikeStatus = async (token, commentId) => {
    const response = await fetch(`${BASE_URL}/comment/${commentId}/status`, {
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
