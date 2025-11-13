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

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
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
    if (error.response?.data?.message) {
      return [null, error.response.data.message];
    }

    if (error.message) {
      return [null, error.message];
    }

    return [null, 'Unexpected error'];
  }
};
