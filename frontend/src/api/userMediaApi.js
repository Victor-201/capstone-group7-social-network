import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/user`;

export const changeUserImage = async (token, file, imageType) => {
  const formData = new FormData();
  formData.append("media", file); 

  const response = await fetch(`${BASE_URL}/${imageType}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
};
