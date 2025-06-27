// api/chatApi.js
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

export const getChats = async (token) =>
  fetchApi(`${BASE_URL}/chats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const createChat = async (token, participants) =>
  fetchApi(`${BASE_URL}/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ participants }),
  });

export const getChatById = async (token, chatId) =>
  fetchApi(`${BASE_URL}/${chatId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const updateChat = async (token, chatId, updateData) =>
  fetchApi(`${BASE_URL}/update/${chatId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

export const deleteChat = async (token, chatId) =>
  fetchApi(`${BASE_URL}/delete/${chatId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const addParticipant = async (token, chatId, userId) =>
  fetchApi(`${BASE_URL}/add-participant`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chatId, userId }),
  });

export const removeParticipant = async (token, chatId, userId) =>
  fetchApi(`${BASE_URL}/remove-participant`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chatId, userId }),
  });
