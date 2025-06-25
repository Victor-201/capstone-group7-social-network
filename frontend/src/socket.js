import { io } from "socket.io-client";
import { SOCKET_SERVER_URL } from "./config/socketConfig";

const socket = io( SOCKET_SERVER_URL, {
  withCredentials: true,
  autoConnect: false,
});

export default socket;