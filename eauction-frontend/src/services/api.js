import axios from 'axios';
import { clearToken, getToken } from '../utils/tokenUtils';

const getDefaultBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:8080/api`;
  }

  return 'http://localhost:8080/api';
};

const normalizeBaseUrl = (rawUrl) => {
  if (!rawUrl) {
    return getDefaultBaseUrl();
  }

  const trimmed = rawUrl.trim();

  if (!trimmed) {
    return getDefaultBaseUrl();
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `http:${trimmed}`;
  }

  if (trimmed.startsWith(':')) {
    return `http://localhost${trimmed}`;
  }

  if (trimmed.startsWith('/')) {
    if (typeof window !== 'undefined' && window.location?.origin) {
      return `${window.location.origin}${trimmed}`;
    }

    return `http://localhost:8080${trimmed}`;
  }

  return `http://${trimmed}`;
};

const BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

// ADD THIS LOGGING
console.log('API Base URL:', BASE_URL);

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ADD THIS LOGGING
    console.log('=== API Request ===');
    console.log('URL:', config.baseURL + config.url);
    console.log('Method:', config.method);
    console.log('Data:', config.data);
    console.log('Headers:', config.headers);

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // ADD THIS LOGGING
    console.error('=== API Error ===');
    console.error('Status:', error.response?.status);
    console.error('Response Data:', error.response?.data);
    console.error('Error Message:', error.message);

    if (error.response?.status === 401) {
      clearToken();
    }

    return Promise.reject(error);
  },
);

export const handleRequest = async (promise) => {
  try {
    const { data } = await promise;
    return [data, null];
  } catch (error) {
    // ADD MORE SPECIFIC ERROR HANDLING
    if (error.response?.data?.error) {
      return [null, error.response.data.error]; // This matches your backend's error format
    }
    
    if (error.response?.data?.message) {
      return [null, error.response.data.message];
    }

    if (error.message) {
      return [null, error.message];
    }

    return [null, 'Unexpected error'];
  }
};