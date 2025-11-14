import { apiClient, handleRequest } from './api';
import { clearToken, setToken } from '../utils/tokenUtils';

export const login = async (credentials) => {
  const [data, error] = await handleRequest(apiClient.post('/auth/login', credentials));

  if (!data || error) {
    return [null, error ?? 'Unable to login'];
  }

  if (data.token) {
    setToken(data.token);
  }

  return [data, null];
};

export const loginWithGoogle = async (idToken) => {
  const [data, error] = await handleRequest(apiClient.post('/auth/google-login', { idToken }));

  if (!data || error) {
    return [null, error ?? 'Unable to login with Google'];
  }

  if (data.token) {
    setToken(data.token);
  }

  return [data, null];
};

export const register = async (payload) => {
  const [data, error] = await handleRequest(apiClient.post('/auth/register', payload));

  if (!data || error) {
    return [null, error ?? 'Unable to register'];
  }

  if (data.token) {
    setToken(data.token);
  }

  return [data, null];
};

export const fetchProfile = () => handleRequest(apiClient.get('/users/profile'));

export const fetchCurrentUser = () => handleRequest(apiClient.get('/auth/me'));

export const logout = () => {
  clearToken();
};
