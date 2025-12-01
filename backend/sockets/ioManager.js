// backend/src/sockets/ioManager.js
let ioInstance = null;

exports.init = (io) => {
  ioInstance = io;
  return ioInstance;
};

exports.getIO = () => ioInstance;
