// frontend/src/services/notificationService.js
import api from "./apiClient"; // your axios instance

export const fetchNotifications = (page = 1, limit = 20) =>
  api.get(`/notifications?page=${page}&limit=${limit}`);

export const fetchUnreadCount = () =>
  api.get("/notifications/unread-count");

export const markNotificationRead = (id) =>
  api.post(`/notifications/${id}/mark-read`);

export const markAllRead = () =>
  api.post("/notifications/mark-all-read");

export const deleteNotification = (id) =>
  api.delete(`/notifications/${id}`);
