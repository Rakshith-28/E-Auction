import { apiClient, handleRequest } from './api';

export const addToCart = (itemId) => handleRequest(apiClient.post(`/cart/${itemId}`));
export const removeFromCart = (itemId) => handleRequest(apiClient.delete(`/cart/${itemId}`));
export const clearCart = () => handleRequest(apiClient.delete('/cart'));
export const getCartItems = () => handleRequest(apiClient.get('/cart'));
export const getCartCount = () => handleRequest(apiClient.get('/cart/count'));
export const checkInCart = (itemId) => handleRequest(apiClient.get(`/cart/check/${itemId}`));
