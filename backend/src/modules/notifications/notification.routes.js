// backend/src/modules/notifications/notification.routes.js
const router = require("express").Router();
const controller = require("./notification.controller");
const auth = require("../../middleware/authMiddleware");

router.use(auth); // all notification routes require auth

router.get("/", controller.list); // /notifications?page=1&limit=20
router.get("/unread-count", controller.unreadCount);
router.post("/mark-all-read", controller.markAllRead);
router.post("/:id/mark-read", controller.markRead);
router.delete("/:id", controller.delete);

module.exports = router;
