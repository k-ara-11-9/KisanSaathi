import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Returns { user, login, logout }. Falls back to an empty user if no
 * <AuthProvider> is mounted yet, so components relying on it don't crash
 * during early development.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx || { user: null, login: () => {}, logout: () => {} };
}
