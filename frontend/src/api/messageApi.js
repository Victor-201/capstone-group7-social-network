import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/message`;

// Gửi tin nhắn
export const sendMessage = async (token, messageData) => {
    const response = await fetch(`${BASE_URL}/send`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Lấy tin nhắn trong cuộc trò chuyện
export const getChatMessages = async (token, chatId, page = 1, limit = 20) => {
    const response = await fetch(`${BASE_URL}/chat/${chatId}?page=${page}&limit=${limit}`, {
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

// Cập nhật tin nhắn
export const updateMessage = async (token, messageId, content) => {
    const response = await fetch(`${BASE_URL}/update/${messageId}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Xóa tin nhắn
export const deleteMessage = async (token, messageId) => {
    const response = await fetch(`${BASE_URL}/delete/${messageId}`, {
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

// Đánh dấu tin nhắn đã đọc
export const markMessagesAsRead = async (token, chatId) => {
    const response = await fetch(`${BASE_URL}/mark-read`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Upload file/media cho tin nhắn
export const uploadMessageMedia = async (token, formData) => {
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
