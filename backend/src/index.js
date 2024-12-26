import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
const app = express();
dotenv.config();

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const PORT = process.env.PORT;
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {}; //{userId:socketId}

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("onlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`);
    delete userSocketMap[userId];
    io.emit("onlineUsers", Object.keys(userSocketMap));
  });
});

server.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
  connectDB();
});
