// backend/src/modules/auth/auth.controller.js
const { registerSchema, loginSchema } = require("./auth.validation");
const authService = require("./auth.service");
const User = require("../user/user.model"); 
exports.register = async (req, res, next) => {
  try {
    const value = await registerSchema.validateAsync(req.body);
    const user = await authService.register(value);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    next(err); 
  }
};
exports.login = async (req, res, next) => {
  try {
    const value = await loginSchema.validateAsync(req.body);
    const result = await authService.login(value);
    res.json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      message: "Current user fetched",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
