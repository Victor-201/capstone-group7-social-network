import { API_BASE_URL } from "../config/apiConfig";
const BASE_URL = `${API_BASE_URL}/user`;

export const getNotifications = async (token) => {
    const response = await fetch(`${BASE_URL}/notifications`, {
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
}

export const markAsRead = async (token, notificationId) => {
    if (!notificationId) throw new Error('Notification ID is required');

    const response = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.result || data;
};

export const markAsUnRead = async (token, notificationId) => {
    if (!notificationId) throw new Error('Notification ID is required');

    const response = await fetch(`${BASE_URL}/notifications/${notificationId}/unread`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.result || data;
};

export const markAllAsRead = async (token) => {
    const response = await fetch(`${BASE_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.result || data;
};

export const deleteNotification = async (token, notificationId) => {
    const response = await fetch(`${BASE_URL}/notifications/${notificationId}/delete`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
    }
    return data.result || data;
}

export const deleteReadNotifications = async (token) => {
    const response = await fetch(`${BASE_URL}/notifications/delete-read`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
    }
    return data.result || data;
};

export const getUnreadCount = async (token) => {
    const response = await fetch(`${BASE_URL}/notifications/unread-count`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.result || data; 
};

