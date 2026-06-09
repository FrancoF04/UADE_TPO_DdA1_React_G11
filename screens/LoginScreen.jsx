import { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/config/colors';
import styles from './LoginScreen.styles';

export default function LoginScreen({ navigation }) {
  const {
    login,
    pendingBiometric,
    loginWithBiometric,
    shouldOfferBiometric,
    enableBiometric,
    dismissBiometricOptIn,
  } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // si hay sesion guardada con huella habilitada, pedimos la huella directo
  useEffect(() => {
    if (pendingBiometric) loginWithBiometric();
  }, [pendingBiometric]);

  const offerBiometricOptIn = async () => {
    if (!(await shouldOfferBiometric())) return;
    Alert.alert(
      '¿Activar ingreso con huella?',
      'La próxima vez vas a poder entrar con tu huella en lugar de escribir la contraseña.',
      [
        { text: 'Ahora no', style: 'cancel', onPress: dismissBiometricOptIn },
        { text: 'Activar', onPress: enableBiometric },
      ]
    );
  };

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      setError('Completá todos los campos.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(identifier.trim(), password);
      await offerBiometricOptIn();
      // la navegación la maneja AppNavigator al cambiar isAuthenticated
    } catch (e) {
      if (e.response?.status === 401) {
        setError('Usuario o contraseña incorrectos.');
      } else {
        setError('No se pudo conectar. Verificá la red.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Iniciar sesión</Text>
      <Text style={styles.subtitle}>Ingresá para controlar el robot</Text>

      <TextInput
        style={styles.input}
        placeholder="Email o usuario"
        placeholderTextColor={COLORS.disabledText}
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={COLORS.disabledText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color={COLORS.white} />
          : <Text style={styles.btnText}>Iniciar sesión</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>¿No tenés cuenta? Registrate</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
