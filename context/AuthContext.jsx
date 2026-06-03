import { createContext, useState, useEffect } from 'react';
import { login as loginRequest } from '../services/authService';
import { setupInterceptors, refreshSession } from '../services/api';
import { decodeToken } from '../utils/token';
import { isBiometricAvailable, promptBiometric } from '../utils/biometrics';
import {
  saveSession,
  clearSession,
  getAccessToken,
  getAccessExpiresAt,
  getRefreshExpiresAt,
  getStoredUsername,
  isBiometricEnabled,
  setBiometricEnabled,
  isBiometricDismissed,
  setBiometricDismissed,
} from '../utils/sessionStorage';

export const AuthContext = createContext(null);

function buildUser(token, username) {
  const payload = decodeToken(token);
  return { username, fullName: payload?.fullName ?? null, userId: payload?.userId ?? null };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingBiometric, setPendingBiometric] = useState(false);

  const logout = async () => {
    await clearSession();
    setUser(null);
    setPendingBiometric(false);
  };

  useEffect(() => {
    setupInterceptors(() => {
      setUser(null);
      setPendingBiometric(false);
    });
  }, []);

  useEffect(() => {
    const restore = async () => {
      const token = await getAccessToken();
      const accessExpiresAt = await getAccessExpiresAt();

      if (token && accessExpiresAt && Date.now() < accessExpiresAt) {
        setUser(buildUser(token, await getStoredUsername()));
        setLoading(false);
        return;
      }

      const refreshExpiresAt = await getRefreshExpiresAt();
      const refreshValid = refreshExpiresAt && Date.now() < refreshExpiresAt;
      if (refreshValid && (await isBiometricEnabled()) && (await isBiometricAvailable())) {
        setPendingBiometric(true);
      }
      setLoading(false);
    };
    restore();
  }, []);

  const login = async (username, password) => {
    const { accessToken, refreshToken } = await loginRequest(username, password);
    await saveSession({ accessToken, refreshToken, username });
    setUser(buildUser(accessToken, username));
    setPendingBiometric(false);
  };

  const loginWithBiometric = async () => {
    const ok = await promptBiometric();
    if (!ok) return false;

    const refreshed = await refreshSession();
    if (!refreshed) {
      setPendingBiometric(false);
      return false;
    }

    const token = await getAccessToken();
    setUser(buildUser(token, await getStoredUsername()));
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
        loading,
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
