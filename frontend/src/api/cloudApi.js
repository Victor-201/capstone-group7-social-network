import { CLOUD_IMAGE_BASE_URL, CLOUD_VIDEO_BASE_URL } from "../config/cloudConfig";

export const loadMediaCloud = async (media_id, media_type) => {
  const baseUrl = media_type === 'image' ? CLOUD_IMAGE_BASE_URL : CLOUD_VIDEO_BASE_URL;
  const response = await fetch(`${baseUrl}/${media_id}`);

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (_) {} 
    throw new Error(errorMessage);
  }

  return await response.json(); 
};
