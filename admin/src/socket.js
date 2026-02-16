import { io } from "socket.io-client";

const socketBase = (import.meta.env.VITE_SOCKET_URL || "").trim();
const apiBase = (import.meta.env.VITE_API_URL || "").trim();
const SOCKET_URL = socketBase || apiBase.replace(/\/api\/?$/, "");

if (!SOCKET_URL) {
  throw new Error(
    "Missing VITE_SOCKET_URL (or VITE_API_URL) in admin environment."
  );
}

let socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export const connectSocket = (uid) => {
  if (!uid) return socket;
  if (socket.connected) return socket;

  socket.auth = { uid };   // ✅ not token anymore
  socket.connect();
  console.log("🔌 Socket connected for user:", uid);
  return socket;
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

export default socket;
