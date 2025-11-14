import { apiClient, handleRequest } from './api';

export const updateProfile = (payload) => handleRequest(apiClient.put('/users/profile', payload));

export const requestSellerRole = () => handleRequest(apiClient.post('/users/roles/seller'));

export const addRole = (role) => handleRequest(apiClient.put('/users/add-role', { role }));
