import { io } from "socket.io-client";
import axios from "axios";
import { getStore } from "../../utils/storeUtil";
import { setUser } from "../../redux/slices/userSlice";

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

let isRefreshing = false;

socket.on("connect_error", async (error) => {
  console.log("Socket connection error:", error);

  if (error.message === "jwt expired" && !isRefreshing) {
    isRefreshing = true;
    try {
      const refreshToken = sessionStorage.getItem("refreshtkn");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/renew-accesstoken`,
        { refreshToken }
      );

      const newAccessToken = response.data.newAccessToken;
      sessionStorage.setItem("actkn", newAccessToken);

      socket.auth = { token: newAccessToken };

      socket.connect();
    } catch (error) {
      getStore().dispatch(setUser(null));

      console.log("Socket connection error:", error);
    } finally {
      isRefreshing = false;
    }
  }
});

export default socket;
