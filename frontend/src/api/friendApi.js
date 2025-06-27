import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/user`;

// Gửi lời mời kết bạn
export const sendFriendRequest = async (token, userId) => {
    const response = await fetch(`${BASE_URL}/friends/request`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friend_id: userId }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Chấp nhận lời mời kết bạn
export const acceptFriendRequest = async (token, requesterId) => {
    const response = await fetch(`${BASE_URL}/friends/respond`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friend_id: requesterId, status: 'accepted' }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result;
};

// Từ chối lời mời kết bạn
export const rejectFriendRequest = async (token, requesterId) => {
    const response = await fetch(`${BASE_URL}/friends/respond`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friend_id: requesterId, status: 'rejected' }),
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
    const response = await fetch(`${BASE_URL}/friends/${friendId}`, {
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

// Lấy danh sách bạn bè
export const getFriends = async (token, userId) => {
    const response = await fetch(`${BASE_URL}/friends${userId ? `?userId=${userId}` : ''}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result;
};

// Lấy danh sách lời mời kết bạn đã gửi
export const getSentRequests = async (token) => {
    const response = await fetch(`${BASE_URL}/friends/sent-requests`, {
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

    const result = await response.json();
    return result;
};

// Lấy danh sách lời mời kết bạn đã nhận
export const getReceivedRequests = async (token) => {
    const response = await fetch(`${BASE_URL}/friends/received-requests`, {
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

    const result = await response.json();
    return result;
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

// Lấy gợi ý kết bạn
export const getFriendSuggestions = async (token) => {
    const response = await fetch(`${BASE_URL}/friends/suggest`, {
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

    const result = await response.json();
    return result;
};

// Lấy danh sách bạn chung
export const getMutualFriends = async (token, friendId) => {
    const response = await fetch(`${BASE_URL}/friends/mutual/${friendId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        
        // Handle "No mutual friends found" as a special case
        if (response.status === 404 && errorData.message === "No mutual friends found") {
            return { mutualFriends: [] };
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result;
};
