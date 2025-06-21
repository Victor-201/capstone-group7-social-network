import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/follow`;

// Follow user
export const followUser = async (token, userId) => {
    const response = await fetch(`${BASE_URL}/follow`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Unfollow user
export const unfollowUser = async (token, userId) => {
    const response = await fetch(`${BASE_URL}/unfollow`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Lấy danh sách người đang follow
export const getFollowing = async (token, userId) => {
    const response = await fetch(`${BASE_URL}/following${userId ? `?userId=${userId}` : ''}`, {
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

// Lấy danh sách followers
export const getFollowers = async (token, userId) => {
    const response = await fetch(`${BASE_URL}/followers${userId ? `?userId=${userId}` : ''}`, {
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

// Kiểm tra trạng thái follow
export const getFollowStatus = async (token, userId) => {
    const response = await fetch(`${BASE_URL}/status/${userId}`, {
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
