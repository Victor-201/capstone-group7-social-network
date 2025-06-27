// useNotifications.js
import { useEffect, useState } from "react";
import useSocket from "../../socket";
import { getNotifications, getUnreadCount } from "../../api/notificationApi";
import { useAuth } from "../../contexts/AuthContext";

export const useNotifications = () => {
  const { auth } = useAuth();
  const socket = useSocket();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!auth.token) return;

    // Gán token trước khi kết nối
    socket.auth = { token: auth.token };
    socket.connect();

    socket.emit("joinNotification");

    loadNotifications();
    loadUnreadCount();

    socket.on("newNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });

    return () => {
      socket.off("newNotification");
      socket.disconnect();
    };
  }, [auth.token]);

  const loadNotifications = async () => {
    const data = await getNotifications(auth.token);
    setNotifications(data);
  };

  const loadUnreadCount = async () => {
    const data = await getUnreadCount(auth.token);
    setUnreadCount(data);
  };

  return {
    notifications,
    unreadCount,
    setNotifications,
    setUnreadCount,
    reloadNotifications: () => {
      loadNotifications();
      loadUnreadCount();
    },
  };
};
