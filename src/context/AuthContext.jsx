import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('guest'); // Default role is guest
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/verify`, {}, { withCredentials: true });
        if (response.status === 200) {
          setUser(response.data.user);
          setRole(response.data.user.role);
        }
      } catch (error) {
        // If verification fails, keep user as guest
        setUser(null);
        setRole('guest');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    setRole(userData.role);
  };

  const logout = async () => {
    try {
      await axios.post(`${apiUrl}/api/logout`, {}, { withCredentials: true });
      setUser(null);
      setRole('guest');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Helper function to check if user has required permissions
  const hasPermission = (requiredRole) => {
    if (requiredRole === 'guest') return true;
    if (requiredRole === 'user') return role === 'user' || role === 'admin';
    if (requiredRole === 'admin') return role === 'admin';
    return false;
  };

  const value = {
    user,
    role,
    loading,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user,
    isGuest: role === 'guest',
    isUser: role === 'user',
    isAdmin: role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 