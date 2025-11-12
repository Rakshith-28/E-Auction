import axios from 'axios';
import { clearToken, getToken } from '../utils/tokenUtils';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

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
