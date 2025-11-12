import { apiClient, handleRequest } from './api';

export const getNotifications = () => handleRequest(apiClient.get('/notifications'));

export const markAsRead = (id) => handleRequest(apiClient.put(`/notifications/${id}/read`));
