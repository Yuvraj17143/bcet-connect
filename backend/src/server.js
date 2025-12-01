// backend/src/server.js
const http = require("http");
const app = require("./app");
const { connectDB } = require("./config/db");
const { PORT } = require("./config/env");
const { init } = require("../sockets/ioManager"); // our manager

connectDB();

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000
});

init(io); // store io instance

require("../sockets/notifications.socket")(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running http://localhost:${PORT}`);
});
