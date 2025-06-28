// api/messageApi.js
import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/user`;

const fetchApi = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `HTTP ${res.status}`);
  }
  return res.json();
};

export const sendMessage = async (token, { chat_id, content }) =>
  fetchApi(`${BASE_URL}/chats/${chat_id}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chat_id, content }),
  });

export const getMessagesByChatId = async (token, chat_id) =>
  fetchApi(`${BASE_URL}/chats/${chat_id}/messages`, {
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

export const markMessagesAsRead = async (token, chat_id) =>
  fetchApi(`${BASE_URL}/chats/${chat_id}/read`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
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
