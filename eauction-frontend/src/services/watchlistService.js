import { apiClient, handleRequest } from './api';

export const addToWatchlist = (itemId) => handleRequest(apiClient.post(`/watchlist/${itemId}`));
export const removeFromWatchlist = (itemId) => handleRequest(apiClient.delete(`/watchlist/${itemId}`));
export const getWatchlist = () => handleRequest(apiClient.get('/watchlist'));
export const checkWatchlist = (itemId) => handleRequest(apiClient.get(`/watchlist/check/${itemId}`));
