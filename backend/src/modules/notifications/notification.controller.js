// backend/src/modules/notifications/notification.controller.js
const service = require("./notification.service");
const ApiError = require("../../utils/ApiError");

exports.list = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const data = await service.getNotificationsForUser(req.user.id, { page, limit });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.unreadCount = async (req, res, next) => {
  try {
    const { unreadCount } = await service.getNotificationsForUser(req.user.id, { page: 1, limit: 1 });
    res.json({ success: true, data: { unreadCount } });
  } catch (err) {
    next(err);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    const notif = await service.markAsRead(req.user.id, req.params.id);
    if (!notif) return next(new ApiError(404, "Notification not found"));
    res.json({ success: true, data: notif });
  } catch (err) {
    next(err);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await service.markAllRead(req.user.id);
    res.json({ success: true, message: "All notifications marked read" });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const doc = await service.deleteNotification(req.user.id, req.params.id);
    if (!doc) return next(new ApiError(404, "Notification not found"));
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
