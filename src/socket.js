// src/socket.js
import { io } from "socket.io-client";

export const socket = io("https://travel-c0ta.onrender.com", {
  withCredentials: true,
  transports: ["websocket"],
});
