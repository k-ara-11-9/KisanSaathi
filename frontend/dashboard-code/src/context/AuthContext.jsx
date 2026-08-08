import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

/**
 * Wrap <App /> with this in main.jsx once real auth (authService.js) is wired up.
 * Swap the mock `user` state for the response of your login/session-check call.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Ramesh Kumar',
    mobile: '9876543210',
    block: 'Block A101',
  });

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
