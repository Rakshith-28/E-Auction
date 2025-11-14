import { apiClient, handleRequest } from './api';

export const getItems = (params = {}) => handleRequest(apiClient.get('/items', { params }));

export const getActiveItems = (params = {}) => handleRequest(apiClient.get('/items/active', { params }));

export const getItemsByStatus = (status, params = {}) => handleRequest(apiClient.get(`/items/status/${status}`, { params }));

export const getItemsBySeller = (sellerId, params = {}) => handleRequest(apiClient.get(`/items/seller/${sellerId}`, { params }));

export const getItem = (id) => handleRequest(apiClient.get(`/items/${id}`));

export const createItem = (payload) => handleRequest(apiClient.post('/items', payload));

export const updateItem = (id, payload) => handleRequest(apiClient.put(`/items/${id}`, payload));

export const deleteItem = (id) => handleRequest(apiClient.delete(`/items/${id}`));

export const getMyItems = () => handleRequest(apiClient.get('/items/mine'));

export const getMyItemsPaged = (params = {}) => handleRequest(apiClient.get('/items/my-items', { params }));

export const closeItem = (id) => handleRequest(apiClient.post(`/items/${id}/close`));
