import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/chat`;

// Lấy danh sách cuộc trò chuyện
export const getChats = async (token) => {
    const response = await fetch(`${BASE_URL}/list`, {
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

// Tạo cuộc trò chuyện mới
export const createChat = async (token, participants) => {
    const response = await fetch(`${BASE_URL}/create`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participants }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Lấy thông tin cuộc trò chuyện
export const getChatById = async (token, chatId) => {
    const response = await fetch(`${BASE_URL}/${chatId}`, {
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

// Cập nhật cuộc trò chuyện
export const updateChat = async (token, chatId, updateData) => {
    const response = await fetch(`${BASE_URL}/update/${chatId}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Xóa cuộc trò chuyện
export const deleteChat = async (token, chatId) => {
    const response = await fetch(`${BASE_URL}/delete/${chatId}`, {
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

// Thêm thành viên vào cuộc trò chuyện
export const addParticipant = async (token, chatId, userId) => {
    const response = await fetch(`${BASE_URL}/add-participant`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId, userId }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Xóa thành viên khỏi cuộc trò chuyện
export const removeParticipant = async (token, chatId, userId) => {
    const response = await fetch(`${BASE_URL}/remove-participant`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId, userId }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};
