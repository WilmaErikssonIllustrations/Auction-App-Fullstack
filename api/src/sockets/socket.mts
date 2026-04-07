import { Server } from "socket.io";
import { server } from "../index.mjs";

export const makeConnection = () => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("user connected");
    io.emit("sendTest", "this is a test emit from backend");

    socket.on("receiveTest", (message: string) => {
      console.log("message:", message);
    });
  });
};
