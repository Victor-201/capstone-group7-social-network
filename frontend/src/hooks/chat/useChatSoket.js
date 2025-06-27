// hooks/useChat.js
import { useEffect, useState } from "react";
import useSocket from "../../socket";
import { useAuth } from "../../contexts/AuthContext";
import {
  getMessagesByChatId,
  countUnreadMessages,
  sendMessage,
  markMessagesAsRead
} from "../../api/messageApi";

export const useChat = (chatId) => {
  const { auth } = useAuth();
  const socket = useSocket();

  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!auth.token || !chatId) return;

    // Gán token và kết nối socket
    socket.auth = { token: auth.token };
    socket.connect();

    // Tham gia phòng chat cụ thể
    socket.emit("joinChat", chatId);

    loadMessages(chatId);
    loadUnreadCount(chatId);

    // Lắng nghe tin nhắn mới
    socket.on("newMessage", (message) => {
      if (message.chatId === chatId) {
        setMessages((prev) => [...prev, message]);
      } else {
        setUnreadCount((prev) => prev + 1);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    return () => {
      socket.off("newMessage");
      socket.disconnect();
    };
  }, [auth.token, chatId]);

  const loadMessages = async (chatId) => {
    try {
      const data = await getMessagesByChatId(auth.token, chatId);
      setMessages(data);
    } catch (err) {
      console.error("Load messages failed:", err);
    }
  };

  const loadUnreadCount = async (chatId) => {
    try {
      const count = await countUnreadMessages(auth.token, chatId);
      setUnreadCount(count);
    } catch (err) {
      console.error("Load unread count failed:", err);
    }
  };

  const handleSendMessage = async (content) => {
    try {
      const newMessage = await sendMessage(auth.token, {
        chatId,
        content,
      });
      // Server sẽ tự emit lại qua socket nên không cần setMessages
      return newMessage;
    } catch (err) {
      console.error("Send message failed:", err);
      throw err;
    }
  };

  const markAsRead = async () => {
    try {
      await markMessagesAsRead(auth.token, chatId);
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark as read failed:", err);
    }
  };

  return {
    messages,
    unreadCount,
    sendMessage: handleSendMessage,
    markAsRead,
    reloadChat: () => {
      loadMessages(chatId);
      loadUnreadCount(chatId);
    },
  };
};
