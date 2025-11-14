import { apiClient, handleRequest } from './api';

export const placeBid = (payload) => handleRequest(apiClient.post('/bids', payload));

export const getBidsForItem = (itemId) => handleRequest(apiClient.get(`/bids/item/${itemId}`));

export const getMyBids = () => handleRequest(apiClient.get('/bids/user'));

export const getBidsOnMyItems = () => handleRequest(apiClient.get('/bids/my-items'));
