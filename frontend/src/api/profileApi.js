import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/profile`;

// Lấy profile details
export const getProfileDetails = async (token, userId) => {
    const response = await fetch(`${BASE_URL}/details${userId ? `?userId=${userId}` : ''}`, {
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

// Cập nhật profile details
export const updateProfileDetails = async (token, profileData) => {
    const response = await fetch(`${BASE_URL}/update-details`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Lấy cài đặt privacy
export const getPrivacySettings = async (token) => {
    const response = await fetch(`${BASE_URL}/privacy`, {
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

// Cập nhật cài đặt privacy
export const updatePrivacySettings = async (token, privacyData) => {
    const response = await fetch(`${BASE_URL}/privacy`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(privacyData),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Upload cover photo
export const uploadCoverPhoto = async (token, formData) => {
    const response = await fetch(`${BASE_URL}/upload-cover`, {
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
