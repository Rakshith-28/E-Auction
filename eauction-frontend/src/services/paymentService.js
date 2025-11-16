import { apiClient, handleRequest } from './api';

export const confirmPayment = (payload) => handleRequest(apiClient.post('/payments/confirm', payload));
export const paymentExists = (params) => handleRequest(apiClient.get('/payments/exists', { params }));
export const getPaymentSummary = (userId) => handleRequest(apiClient.get('/payments/summary', { params: { userId } }));
