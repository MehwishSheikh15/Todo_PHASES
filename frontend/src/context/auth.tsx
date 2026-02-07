'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosInstance } from 'axios';
import API_CONFIG from '@/lib/api-config';

interface User {
  id: string;
  email: string;
  display_name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, display_name?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  apiClient: AxiosInstance;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
  });

  // Attach token
  apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // Only auto-logout on protected calls, NOT login
  apiClient.interceptors.response.use(
    res => res,
    err => Promise.reject(err)
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setUser(JSON.parse(userData));
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    console.log('[AUTH] Attempting login for:', normalizedEmail);

    const formData = new URLSearchParams();
    formData.append('username', normalizedEmail);
    formData.append('password', password);

    try {
      const response = await apiClient.post('auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token, user: userData } = response.data;
      console.log('[AUTH] Login successful for:', normalizedEmail);

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      console.error('[AUTH] Login failed:', error.response?.status, error.response?.data);
      throw error;
    }
  };

  const register = async (email: string, password: string, display_name?: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    console.log('[AUTH] Attempting registration for:', normalizedEmail);

    try {
      await apiClient.post('auth/register', {
        email: normalizedEmail,
        password,
        display_name: display_name || normalizedEmail.split('@')[0],
      });

      console.log('[AUTH] Registration successful, logging in...');
      await login(normalizedEmail, password);
    } catch (error: any) {
      console.error('[AUTH] Registration failed:', error.response?.status, error.response?.data);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
        apiClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
