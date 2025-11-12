import { apiClient, handleRequest } from './api';

export const getItems = (params = {}) => handleRequest(apiClient.get('/items', { params }));

export const getItem = (id) => handleRequest(apiClient.get(`/items/${id}`));

export const createItem = (payload) => handleRequest(apiClient.post('/items', payload));

export const updateItem = (id, payload) => handleRequest(apiClient.put(`/items/${id}`, payload));

export const deleteItem = (id) => handleRequest(apiClient.delete(`/items/${id}`));

export const getMyItems = () => handleRequest(apiClient.get('/items/mine'));
