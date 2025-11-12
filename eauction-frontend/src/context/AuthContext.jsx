import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, login as loginRequest, logout as logoutRequest } from '../services/authService';
import { clearToken, getToken } from '../utils/tokenUtils';

export const AuthContext = createContext({
  user: null,
  loading: false,
  login: async () => {},
  logout: () => {},
  refresh: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      return;
    }

    const [data, fetchError] = await fetchCurrentUser();

    if (fetchError) {
      clearToken();
      setUser(null);
      setError(fetchError);
      return;
    }

    setError(null);
    setUser(data);
  }, []);

  useEffect(() => {
    const initialize = async () => {
      await loadUser();
      setLoading(false);
    };

    initialize();
  }, [loadUser]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    const [, loginError] = await loginRequest(credentials);

    if (loginError) {
      setLoading(false);
      setError(loginError);
      return [null, loginError];
    }

    await loadUser();
    setLoading(false);
    return [true, null];
  }, [loadUser]);

  const logout = useCallback(() => {
    logoutRequest();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    logout,
    refresh: loadUser,
    isAuthenticated: Boolean(user),
    hasRole: (roleOrRoles) => {
      if (!user?.role) return false;

      if (Array.isArray(roleOrRoles)) {
        return roleOrRoles.includes(user.role);
      }

      return user.role === roleOrRoles;
    },
  }), [user, loading, error, login, logout, loadUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
