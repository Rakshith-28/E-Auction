import { apiClient, handleRequest } from './api';

export const getAuctions = (params = {}) => handleRequest(apiClient.get('/auctions', { params }));

export const getActiveAuctions = () => handleRequest(apiClient.get('/auctions/active'));

export const getAuction = (id) => handleRequest(apiClient.get(`/auctions/${id}`));

export const closeAuction = (id) => handleRequest(apiClient.post(`/admin/auctions/${id}/close`));
