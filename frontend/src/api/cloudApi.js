import { CLOUD_IMAGE_BASE_URL, CLOUD_VIDEO_BASE_URL } from "../config/cloudConfig";

export const loadMediaCloud = async (media_id, media_type) => {
  const baseUrl = media_type === 'image' ? CLOUD_IMAGE_BASE_URL : CLOUD_VIDEO_BASE_URL;
  const url = `${baseUrl}/${media_id}`;

  const response = await fetch(url, { method: "HEAD" }); 
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    throw new Error(errorMessage);
  }

  return { url }; 
};
