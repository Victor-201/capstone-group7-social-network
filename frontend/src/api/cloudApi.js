import { CLOUD_IMAGE_BASE_URL, CLOUD_VIDEO_BASE_URL } from "../config/apiConfig";

// Đăng nhập
export const loadMediaCloud = async (media_id, media_type) => {
    const response = await fetch(`${media_type === 'image' ? CLOUD_IMAGE_BASE_URL : CLOUD_VIDEO_BASE_URL}/${media_id}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    return await response.json();
};