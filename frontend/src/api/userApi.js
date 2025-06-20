import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/user`;

// Lấy thông tin user hiện tại
export const getUserInfo = async (token) => {
    const response = await fetch(`${BASE_URL}/profile`, {
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

// Lấy thông tin user theo ID
export const getUserById = async (token, userId) => {
    const response = await fetch(`${BASE_URL}/${userId}`, {
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

// Cập nhật thông tin user
export const updateUserInfo = async (token, userData) => {
    const response = await fetch(`${BASE_URL}/update`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Đổi mật khẩu
export const changePassword = async (token, passwordData) => {
    const response = await fetch(`${BASE_URL}/change-password`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Upload avatar
export const uploadAvatar = async (token, formData) => {
    const response = await fetch(`${BASE_URL}/upload-avatar`, {
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