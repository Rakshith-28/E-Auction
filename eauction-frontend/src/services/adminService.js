import { apiClient, handleRequest } from './api';

export const getDashboard = () => handleRequest(apiClient.get('/admin/dashboard'));

export const getUsers = () => handleRequest(apiClient.get('/admin/users'));

export const deleteUser = (id) => handleRequest(apiClient.delete(`/admin/users/${id}`));

export const updateItemStatus = (id, status) => handleRequest(apiClient.put(`/admin/items/${id}/status`, { status }));

export const getAdminItems = (params = {}) => handleRequest(apiClient.get('/admin/items', { params }));
