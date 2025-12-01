//backend/src/modules/auth/auth.routes.js
const router = require("express").Router();
const controller = require("./auth.controller");
const authMiddleware = require("../../middleware/authMiddleware");
router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", authMiddleware, controller.me);
module.exports = router;
