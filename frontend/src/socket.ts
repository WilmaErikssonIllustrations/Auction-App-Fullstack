import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("sendTest", (message: string) => {
  console.log(message);
});

socket.emit("receiveTest", "testing from frontend");
