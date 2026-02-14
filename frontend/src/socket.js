import { io } from "socket.io-client";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").trim();
const SOCKET_URL = API_BASE
  ? API_BASE.replace(/\/api\/?$/, "")
  : window.location.origin;

let socket;

export const connectSocket = (uid) => {
  if (!uid) return socket;
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"], // ✅ DO NOT FORCE ONLY WEBSOCKET
    withCredentials: true,                // ✅ MATCH SERVER
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    auth: {
      uid,                                // ✅ AUTH AT INIT TIME
    },
  });

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id, "UID:", uid);
  });

  socket.on("connect_error", (err) => {
    console.error("🔴 Socket connect error:", err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
};

export default connectSocket;
