import { SOCKET_URL } from "config";
import { io } from "socket.io-client/dist/socket.io.js";
// import { io } from "socket.io-client";
// export const socket = io("https://quizza-backend-app.herokuapp.com/");
export const socket = io(SOCKET_URL + "/");
// export const socket = io(SOCKET_URL, { autoConnect: false, transports: ["polling"], reconnection:false });
// export const socket = io(SOCKET_URL, { autoConnect: false, multiplex:false });
// export const socket = io(SOCKET_URL, {
//     transports: ["polling", "websocket"], // use WebSocket first, if available
//     reconnectionDelayMax: 20000,
//   });
