// api/messageApi.js
import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/message`;

const fetchApi = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `HTTP ${res.status}`);
  }
  return res.json();
};

export const sendMessage = async (token, messageData) =>
  fetchApi(`${BASE_URL}/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageData),
  });

export const getMessagesByChatId = async (token, chatId, page = 1, limit = 20) =>
  fetchApi(`${BASE_URL}/chat/${chatId}?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const updateMessage = async (token, messageId, content) =>
  fetchApi(`${BASE_URL}/update/${messageId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

export const deleteMessage = async (token, messageId) =>
  fetchApi(`${BASE_URL}/delete/${messageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const markMessagesAsRead = async (token, chatId) =>
  fetchApi(`${BASE_URL}/mark-read`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chatId }),
  });

export const countUnreadMessages = async (token, chatId) =>
  fetchApi(`${BASE_URL}/chat/${chatId}/unread-count`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const uploadMessageMedia = async (token, formData) => {
  const res = await fetch(`${BASE_URL}/upload-media`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `HTTP ${res.status}`);
  }
  return res.json();
};
