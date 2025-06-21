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
