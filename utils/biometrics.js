import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export async function isBiometricAvailable() {
  if (Platform.OS === 'web') return false;
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return hasHardware && isEnrolled;
}

export async function promptBiometric() {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Ingresar a XploreNow',
    fallbackLabel: 'Usar contraseña',
    cancelLabel: 'Cancelar',
  });
  return result.success;
}
