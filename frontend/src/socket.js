// useSocket.js
import { useMemo } from "react";
import { io } from "socket.io-client";
import { SOCKET_SERVER_URL } from "./config/socketConfig";

const useSocket = () => {
  const socket = useMemo(() => {
    return io(SOCKET_SERVER_URL, {
      withCredentials: true,
      autoConnect: false,
    });
  }, []);

  return socket;
};

export default useSocket;
