import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/friend`;

// Gửi lời mời kết bạn
export const sendFriendRequest = async (token, userId) => {
    const response = await fetch(`${BASE_URL}/request`, {
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

// Chấp nhận lời mời kết bạn
export const acceptFriendRequest = async (token, requestId) => {
    const response = await fetch(`${BASE_URL}/accept`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Từ chối lời mời kết bạn
export const rejectFriendRequest = async (token, requestId) => {
    const response = await fetch(`${BASE_URL}/reject`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Hủy lời mời kết bạn
export const cancelFriendRequest = async (token, requestId) => {
    const response = await fetch(`${BASE_URL}/cancel`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Hủy kết bạn
export const unfriend = async (token, friendId) => {
    const response = await fetch(`${BASE_URL}/unfriend`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Lấy danh sách bạn bè
export const getFriends = async (token, userId) => {
    const response = await fetch(`${BASE_URL}/list${userId ? `?userId=${userId}` : ''}`, {
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

// Lấy danh sách lời mời kết bạn đã gửi
export const getSentRequests = async (token) => {
    const response = await fetch(`${BASE_URL}/sent-requests`, {
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

// Lấy danh sách lời mời kết bạn đã nhận
export const getReceivedRequests = async (token) => {
    const response = await fetch(`${BASE_URL}/received-requests`, {
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

// Kiểm tra trạng thái kết bạn
export const getFriendshipStatus = async (token, userId) => {
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
