import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/search`;

// Tìm kiếm users
export const searchUsers = async (token, query, page = 1, limit = 10) => {
    const response = await fetch(`${BASE_URL}/users?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, {
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

// Tìm kiếm posts
export const searchPosts = async (token, query, page = 1, limit = 10) => {
    const response = await fetch(`${BASE_URL}/posts?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, {
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

// Tìm kiếm tổng quát
export const globalSearch = async (token, query, type = 'all', page = 1, limit = 10) => {
    const response = await fetch(`${BASE_URL}/global?q=${encodeURIComponent(query)}&type=${type}&page=${page}&limit=${limit}`, {
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

// Lấy lịch sử tìm kiếm
export const getSearchHistory = async (token) => {
    const response = await fetch(`${BASE_URL}/history`, {
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

// Xóa lịch sử tìm kiếm
export const clearSearchHistory = async (token) => {
    const response = await fetch(`${BASE_URL}/history`, {
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
