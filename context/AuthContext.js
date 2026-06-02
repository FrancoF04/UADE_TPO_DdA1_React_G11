// [TEST/TEMPORAL] Implementación mínima de autenticación para testear Features 2 y 3.
// Será reemplazada por la implementación real de Features 5 y 6.
// Para integrar: ver test/CLEANUP.md — sección Features 5 y 6.
import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/services/api';
import { authService } from '@/services/authService';

const TOKEN_KEY = 'auth_token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token;

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
  }, []);

  // Interceptor de request: adjunta Bearer token en cada llamada
  useEffect(() => {
    const reqId = api.interceptors.request.use(async (config) => {
      const stored = await SecureStore.getItemAsync(TOKEN_KEY);
      if (stored) config.headers.Authorization = `Bearer ${stored}`;
      return config;
    });

    // Interceptor de response: cierra sesión ante 401
    const resId = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error.response?.status === 401) await logout();
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
  }, [logout]);

  // Restaurar sesión al montar
  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await SecureStore.getItemAsync(TOKEN_KEY);
        if (stored) setToken(stored);
      } catch {
        // Si falla la lectura, iniciar sin sesión
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const login = async (identifier, password) => {
    const { data } = await authService.login(identifier, password);
    await SecureStore.setItemAsync(TOKEN_KEY, data.access_token);
    setToken(data.access_token);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
