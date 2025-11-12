const TOKEN_KEY = 'eauction_token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
