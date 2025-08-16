import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL, {
  auth: {},
  autoConnect: false,
  reconnection: true,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("reconnect_attempt", () => {
  socket.auth.token = sessionStorage.getItem("actkn");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

export default socket;
