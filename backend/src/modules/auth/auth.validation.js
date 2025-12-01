// backend/src/modules/auth/auth.validation.js
const Joi = require("joi");
exports.registerSchema = Joi.object({
  name: Joi.string().min(3).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid("student", "alumni", "faculty", "admin")
    .default("student"),
});
exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
