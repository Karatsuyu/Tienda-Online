'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'LOADING' }
  | { type: 'ERROR'; payload: string }
  | { type: 'RESTORE_TOKEN'; payload: { user: User; token: string } }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
  error: null,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGOUT':
      return initialState;
    case 'ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'RESTORE_TOKEN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore token from localStorage on mount
  useEffect(() => {
    const restoreToken = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Verify token by fetching current user
          const user = await authAPI.getMe() as User;
          dispatch({
            type: 'RESTORE_TOKEN',
            payload: { user, token },
          });
        } else {
          dispatch({ type: 'LOADING' });
        }
      } catch (error) {
        dispatch({ type: 'LOADING' });
      }
    };

    restoreToken();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOADING' });
    try {
      const response = await authAPI.login(email, password);
      const token = response.access_token;

      // Store token
      localStorage.setItem('authToken', token);

      // Fetch user data
      const user = await authAPI.getMe() as User;

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fallo al iniciar sesión';
      dispatch({ type: 'ERROR', payload: message });
      throw error;
    }
  };

  const register = async (email: string, password: string, full_name: string) => {
    dispatch({ type: 'LOADING' });
    try {
      await authAPI.register(email, password, full_name);
      // After successful registration, auto-login
      await login(email, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fallo en el registro';
      dispatch({ type: 'ERROR', payload: message });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
