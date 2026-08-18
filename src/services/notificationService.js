// ===============================================
// KV Projects ERP
// notificationService.js
// ===============================================

import api from "./api";

// Get notifications for the logged-in user
// params: { isRead, limit, page }
export const getNotifications = (params) =>
  api.get("/notifications", { params });

// Mark a single notification as read
export const markAsRead = (id) => api.patch(`/notifications/${id}/read`);

// Mark all notifications as read
export const markAllAsRead = () => api.patch("/notifications/mark-all-read");

// Delete a notification
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
