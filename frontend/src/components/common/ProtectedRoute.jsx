import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

/**
 * Wrap any app-shell route with this. Currently AuthContext seeds a mock
 * user so every route is reachable during development — swap that mock
 * for a real session check (authService.js) before shipping, at which
 * point unauthenticated visitors will bounce to /login automatically.
 */
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
}
