// backend/src/sockets/notifications.socket.js
// Called from server.js after io created
module.exports = (io) => {
  io.on("connection", (socket) => {
    // Expect client to send "auth:join" with userId after connecting
    socket.on("auth:join", (payload) => {
      try {
        const { userId } = payload || {};
        if (userId) {
          socket.join(String(userId)); // room per user
          console.log(`Socket ${socket.id} joined room ${userId}`);
        }
      } catch (err) {
        console.error("auth:join error", err.message);
      }
    });

    socket.on("disconnect", () => {
      // room leaves automatic
    });
  });
};
