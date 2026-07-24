import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('pizzahub_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [admin, setAdmin] = useState(() => {
    const raw = localStorage.getItem('pizzahub_admin');
    return raw ? JSON.parse(raw) : null;
  });

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('pizzahub_user_token', data.token);
    localStorage.setItem('pizzahub_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('pizzahub_user_token', data.token);
    localStorage.setItem('pizzahub_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pizzahub_user_token');
    localStorage.removeItem('pizzahub_user');
    setUser(null);
  }, []);

  const adminLogin = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/admin-login', { email, password });
    localStorage.setItem('pizzahub_admin_token', data.token);
    localStorage.setItem('pizzahub_admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data.admin;
  }, []);

  const adminLogout = useCallback(() => {
    localStorage.removeItem('pizzahub_admin_token');
    localStorage.removeItem('pizzahub_admin');
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, admin, login, register, logout, adminLogin, adminLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
