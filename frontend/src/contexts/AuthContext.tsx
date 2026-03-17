'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AuthUser {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
  isLoggedIn: boolean;
}

// ── Hardcoded admin account ──────────────────────────────────────────────────
export const ADMIN_EMAIL = 'admin@ragapp.com';
const ADMIN_PASSWORD = 'admin123';

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  isAdmin: false,
  isLoggedIn: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;
        // Get user info
        const userResponse = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const u: AuthUser = { name: userData.username, email: userData.email, role: userData.role };
          setUser(u);
          localStorage.setItem('currentUser', JSON.stringify(u));
          localStorage.setItem('token', token);
          return { success: true };
        } else {
          return { success: false, error: 'Failed to get user info.' };
        }
      } else {
        return { success: false, error: 'Invalid email or password.' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed.' };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;
        // Get user info
        const userResponse = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const u: AuthUser = { name: userData.username, email: userData.email, role: userData.role };
          setUser(u);
          localStorage.setItem('currentUser', JSON.stringify(u));
          localStorage.setItem('token', token);
          return { success: true };
        } else {
          return { success: false, error: 'Failed to get user info.' };
        }
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.detail || 'Registration failed.' };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
        isLoggedIn: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

