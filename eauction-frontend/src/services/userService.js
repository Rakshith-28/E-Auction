import { apiClient, handleRequest } from './api';

export const getProfile = () => handleRequest(apiClient.get('/users/profile'));
export const getCurrentUser = () => handleRequest(apiClient.get('/users/me'));
export const getUserById = (userId) => handleRequest(apiClient.get(`/users/${userId}`));
export const getUserStats = () => handleRequest(apiClient.get('/users/stats'));
export const updateProfile = (payload) => handleRequest(apiClient.put('/users/profile', payload));
export const changePassword = (data) => handleRequest(apiClient.post('/users/change-password', data));
export const deleteAccount = (password) => handleRequest(apiClient.delete('/users/account', { data: { password } }));
export const deactivateAccount = () => handleRequest(apiClient.put('/users/deactivate'));
export const requestSellerRole = () => handleRequest(apiClient.post('/users/roles/seller'));
export const addRole = (role) => handleRequest(apiClient.put('/users/add-role', { role }));

