// backend/src/modules/notifications/notification.service.js
const Notification = require("./notification.model");
const ioManager = require("../../../sockets/ioManager"); // helper to get io instance (see integration)

exports.createNotification = async ({ userId, senderId = null, type, title, message = "", redirectUrl = "", metadata = {} }) => {
  const doc = await Notification.create({
    user: userId,
    sender: senderId,
    type,
    title,
    message,
    redirectUrl,
    metadata
  });

  // Emit realtime event if socket connected
  try {
    const io = ioManager.getIO();
    if (io) {
      // emit to user room
      io.to(String(userId)).emit("notification:new", {
        _id: doc._id,
        user: doc.user,
        sender: doc.sender,
        type: doc.type,
        title: doc.title,
        message: doc.message,
        redirectUrl: doc.redirectUrl,
        metadata: doc.metadata,
        isRead: doc.isRead,
        createdAt: doc.createdAt
      });
    }
  } catch (err) {
    console.error("Notification emit error:", err.message);
  }

  return doc;
};

exports.getNotificationsForUser = async (userId, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "name avatar role")
      .lean(),
    Notification.countDocuments({ user: userId })
  ]);

  const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

  return { items, total, page, limit, unreadCount };
};

exports.markAsRead = async (userId, notifId) => {
  const doc = await Notification.findOneAndUpdate(
    { _id: notifId, user: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
  return doc;
};

exports.markAllRead = async (userId) => {
  const res = await Notification.updateMany({ user: userId, isRead: false }, { isRead: true, readAt: new Date() });
  return res;
};

exports.deleteNotification = async (userId, notifId) => {
  return Notification.findOneAndDelete({ _id: notifId, user: userId });
};
