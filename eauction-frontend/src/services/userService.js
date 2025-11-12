import { apiClient, handleRequest } from './api';

export const updateProfile = (payload) => handleRequest(apiClient.put('/users/profile', payload));
