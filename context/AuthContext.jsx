import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '@/services/authService';
import { setupInterceptors } from '@/services/api';
import { decodeToken, getTokenExpiry, isExpired } from '@/utils/token';
import { saveSession, clearSession, getAccessToken } from '@/utils/sessionStorage';

const AuthContext = createContext(null);

function buildUser(token) {
  const payload = decodeToken(token);
  return { username: payload?.sub ?? null };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const logout = async () => {
    await clearSession();
    setUser(null);
  };

  // ante un 401 el interceptor limpia la sesion y avisa aca
  useEffect(() => {
    setupInterceptors(() => setUser(null));
  }, []);

  // restaurar sesion al montar, descartando tokens vencidos
  useEffect(() => {
    const restore = async () => {
      const token = await getAccessToken();
      if (token && !isExpired(getTokenExpiry(token))) {
        setUser(buildUser(token));
      } else if (token) {
        await clearSession();
      }
      setIsLoading(false);
    };
    restore();
  }, []);

  const login = async (identifier, password) => {
    const { data } = await authService.login(identifier, password);
    await saveSession(data.access_token);
    setUser(buildUser(data.access_token));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
