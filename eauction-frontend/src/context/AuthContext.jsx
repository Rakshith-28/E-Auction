import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirebaseAuth } from '../firebase';
import {
  fetchCurrentUser,
  login as loginRequest,
  loginWithGoogle as loginWithGoogleRequest,
  logout as logoutRequest,
} from '../services/authService';
import { clearToken, getToken } from '../utils/tokenUtils';

export const AuthContext = createContext({
  user: null,
  loading: false,
  login: async () => {},
  loginWithGoogle: async () => {},
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
    setError(null);
    setLoading(true);
    const [data, loginError] = await loginRequest(credentials);

    if (loginError) {
      setLoading(false);
      setError(loginError);
      return [null, loginError];
    }

    await loadUser();
    setLoading(false);
    return [data, null];
  }, [loadUser]);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const firebaseAuth = getFirebaseAuth();
      const result = await signInWithPopup(firebaseAuth, provider);
      const idToken = await result.user.getIdToken();
      const [data, googleError] = await loginWithGoogleRequest(idToken);

      if (googleError) {
        setLoading(false);
        setError(googleError);
        return [null, googleError];
      }

      await loadUser();
      setLoading(false);
      return [data, null];
    } catch (err) {
      const message = err?.code === 'auth/popup-closed-by-user'
        ? 'Google sign-in was closed before completion.'
        : err?.message?.startsWith('Missing Firebase config')
          ? 'Firebase configuration is incomplete. Update your environment variables to enable Google sign-in.'
          : err?.message ?? 'Unable to sign in with Google';
      setLoading(false);
      setError(message);
      return [null, message];
    }
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
    loginWithGoogle,
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
  }), [user, loading, error, login, loginWithGoogle, logout, loadUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
