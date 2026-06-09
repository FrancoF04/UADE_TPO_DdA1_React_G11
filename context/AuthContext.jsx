import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '@/services/authService';
import { setupInterceptors } from '@/services/api';
import { decodeToken, getTokenExpiry, isExpired } from '@/utils/token';
import { isBiometricAvailable, promptBiometric } from '@/utils/biometrics';
import {
  saveSession,
  clearSession,
  getAccessToken,
  isBiometricEnabled,
  setBiometricEnabled,
  isBiometricDismissed,
  setBiometricDismissed,
} from '@/utils/sessionStorage';

const AuthContext = createContext(null);

function buildUser(token) {
  const payload = decodeToken(token);
  return { username: payload?.sub ?? null };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // hay sesion guardada valida pero falta pasar la huella para entrar
  const [pendingBiometric, setPendingBiometric] = useState(false);

  const isAuthenticated = !!user;

  const logout = async () => {
    await clearSession();
    setUser(null);
    setPendingBiometric(false);
  };

  // ante un 401 el interceptor limpia la sesion y avisa aca
  useEffect(() => {
    setupInterceptors(() => {
      setUser(null);
      setPendingBiometric(false);
    });
  }, []);

  // restaurar sesion al montar, descartando tokens vencidos
  useEffect(() => {
    const restore = async () => {
      const token = await getAccessToken();
      if (token && !isExpired(getTokenExpiry(token))) {
        if ((await isBiometricEnabled()) && (await isBiometricAvailable())) {
          setPendingBiometric(true);
        } else {
          setUser(buildUser(token));
        }
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
    setPendingBiometric(false);
  };

  const loginWithBiometric = async () => {
    const ok = await promptBiometric();
    if (!ok) return false;

    setUser(buildUser(await getAccessToken()));
    setPendingBiometric(false);
    return true;
  };

  const shouldOfferBiometric = async () => {
    if (await isBiometricDismissed()) return false;
    if (await isBiometricEnabled()) return false;
    return isBiometricAvailable();
  };

  const enableBiometric = () => setBiometricEnabled(true);
  const dismissBiometricOptIn = () => setBiometricDismissed(true);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        pendingBiometric,
        login,
        logout,
        loginWithBiometric,
        shouldOfferBiometric,
        enableBiometric,
        dismissBiometricOptIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
