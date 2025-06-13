import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock user for development
  useEffect(() => {
    setCurrentUser({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: true,
      preferences: {
        notifications: true,
        theme: 'light'
      }
    });
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement actual login logic
      setCurrentUser({
        id: '1',
        name: 'Test User',
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVerified: true,
        preferences: {
          notifications: true,
          theme: 'light'
        }
      });
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement actual logout logic
      setCurrentUser(null);
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement actual registration logic
      setCurrentUser({
        id: Date.now().toString(),
        name,
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVerified: false,
        preferences: {
          notifications: true,
          theme: 'light'
        }
      });
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 