import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTokenExpiry } from './token';

const ACCESS_TOKEN = 'auth_token';
const REFRESH_TOKEN = 'refresh_token';
const ACCESS_EXPIRES_AT = 'access_expires_at';
const REFRESH_EXPIRES_AT = 'refresh_expires_at';
const USERNAME = 'auth_username';
const BIOMETRIC_ENABLED = 'biometric_enabled';
const BIOMETRIC_DISMISSED = 'biometric_opt_in_dismissed';

const DEFAULT_ACCESS_TTL_MS = 60 * 60 * 1000;
const DEFAULT_REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function saveSession({ accessToken, refreshToken, username }) {
  const now = Date.now();
  const accessExpiresAt = getTokenExpiry(accessToken) ?? now + DEFAULT_ACCESS_TTL_MS;
  const refreshExpiresAt = getTokenExpiry(refreshToken) ?? now + DEFAULT_REFRESH_TTL_MS;

  await SecureStore.setItemAsync(ACCESS_TOKEN, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN, refreshToken ?? accessToken);
  await SecureStore.setItemAsync(ACCESS_EXPIRES_AT, String(accessExpiresAt));
  await SecureStore.setItemAsync(REFRESH_EXPIRES_AT, String(refreshExpiresAt));
  if (username != null) await SecureStore.setItemAsync(USERNAME, username);
}

export async function getAccessToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN);
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH_TOKEN);
}

export async function getStoredUsername() {
  return SecureStore.getItemAsync(USERNAME);
}

export async function getAccessExpiresAt() {
  const raw = await SecureStore.getItemAsync(ACCESS_EXPIRES_AT);
  return raw ? Number(raw) : null;
}

export async function getRefreshExpiresAt() {
  const raw = await SecureStore.getItemAsync(REFRESH_EXPIRES_AT);
  return raw ? Number(raw) : null;
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN);
  await SecureStore.deleteItemAsync(ACCESS_EXPIRES_AT);
  await SecureStore.deleteItemAsync(REFRESH_EXPIRES_AT);
  await SecureStore.deleteItemAsync(USERNAME);
}

export async function isBiometricEnabled() {
  return (await AsyncStorage.getItem(BIOMETRIC_ENABLED)) === 'true';
}

export async function setBiometricEnabled(enabled) {
  await AsyncStorage.setItem(BIOMETRIC_ENABLED, enabled ? 'true' : 'false');
}

export async function isBiometricDismissed() {
  return (await AsyncStorage.getItem(BIOMETRIC_DISMISSED)) === 'true';
}

export async function setBiometricDismissed(dismissed) {
  await AsyncStorage.setItem(BIOMETRIC_DISMISSED, dismissed ? 'true' : 'false');
}
