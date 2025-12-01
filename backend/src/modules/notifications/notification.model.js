// backend/src/modules/notifications/notification.model.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { // recipient
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    sender: { // optional: who triggered the notification
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    type: {
      type: String,
      enum: ["job","event","community","chat","donation","admin","ai","system"],
      required: true
    },
    title: { type: String, required: true },
    message: { type: String },
    redirectUrl: { type: String }, // frontend route to open on click
    metadata: { type: Object, default: {} }, // extra structured info
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null }
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 }); // helpful for queries

module.exports = mongoose.model("Notification", notificationSchema);
