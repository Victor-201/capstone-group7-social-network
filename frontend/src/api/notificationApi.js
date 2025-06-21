import { API_BASE_URL } from "../config/apiConfig";
<<<<<<< Updated upstream
const BASE_URL = `${API_BASE_URL}/user`;

export const getNotifications = async (token) => {
    const response = await fetch(`${BASE_URL}/notifications`, {
=======

const BASE_URL = `${API_BASE_URL}/notification`;

// Lấy danh sách thông báo
export const getNotifications = async (token, page = 1, limit = 20) => {
    const response = await fetch(`${BASE_URL}/list?page=${page}&limit=${limit}`, {
>>>>>>> Stashed changes
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
<<<<<<< Updated upstream

=======
    
>>>>>>> Stashed changes
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
<<<<<<< Updated upstream
}
=======
};

// Đánh dấu thông báo đã đọc
export const markNotificationAsRead = async (token, notificationId) => {
    const response = await fetch(`${BASE_URL}/mark-read/${notificationId}`, {
        method: 'PUT',
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

// Đánh dấu tất cả thông báo đã đọc
export const markAllNotificationsAsRead = async (token) => {
    const response = await fetch(`${BASE_URL}/mark-all-read`, {
        method: 'PUT',
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

// Xóa thông báo
export const deleteNotification = async (token, notificationId) => {
    const response = await fetch(`${BASE_URL}/delete/${notificationId}`, {
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

// Lấy số lượng thông báo chưa đọc
export const getUnreadNotificationCount = async (token) => {
    const response = await fetch(`${BASE_URL}/unread-count`, {
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
>>>>>>> Stashed changes
