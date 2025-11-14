import { apiClient, handleRequest } from './api';

export const getNotifications = ({ page = 0, size = 10, unread = false, type, read } = {}) =>
	handleRequest(apiClient.get(`/notifications`, { params: { page, size, unread, type, read } }));

export const getUnreadCount = () => handleRequest(apiClient.get('/notifications/unread-count'));

export const markAsRead = (id) => handleRequest(apiClient.put(`/notifications/${id}/read`));
export const markAsUnread = (id) => handleRequest(apiClient.put(`/notifications/${id}/unread`));

export const markAllRead = () => handleRequest(apiClient.put('/notifications/mark-all-read'));

export const deleteNotification = (id) => handleRequest(apiClient.delete(`/notifications/${id}`));
export const clearReadNotifications = () => handleRequest(apiClient.delete('/notifications/clear-read'));
