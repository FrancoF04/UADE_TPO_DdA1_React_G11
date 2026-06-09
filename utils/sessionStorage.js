import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// SecureStore no existe en web, ahi caemos a AsyncStorage (localStorage)
const isWeb = Platform.OS === 'web';
const secureSet = (k, v) => (isWeb ? AsyncStorage.setItem(k, v) : SecureStore.setItemAsync(k, v));
const secureGet = (k) => (isWeb ? AsyncStorage.getItem(k) : SecureStore.getItemAsync(k));
const secureDelete = (k) => (isWeb ? AsyncStorage.removeItem(k) : SecureStore.deleteItemAsync(k));

const ACCESS_TOKEN = 'auth_token';
const BIOMETRIC_ENABLED = 'biometric_enabled';
const BIOMETRIC_DISMISSED = 'biometric_opt_in_dismissed';

export async function saveSession(accessToken) {
  await secureSet(ACCESS_TOKEN, accessToken);
}

export async function getAccessToken() {
  return secureGet(ACCESS_TOKEN);
}

export async function clearSession() {
  await secureDelete(ACCESS_TOKEN);
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
