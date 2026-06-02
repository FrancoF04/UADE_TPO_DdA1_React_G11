import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import styles from './LoginScreen.styles';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      setError('Completá todos los campos.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(identifier.trim(), password);
      // La navegación la maneja AppNavigator condicionalmente al cambiar isAuthenticated
    } catch (e) {
      const status = e.response?.status;
      if (status === 401) {
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
      <Text style={styles.subtitle}>Mock de Features 5/6 — solo para testing</Text>

      <TextInput
        style={styles.input}
        placeholder="Email o usuario"
        placeholderTextColor="#484f58"
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#484f58"
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
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnText}>Iniciar sesión</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>¿No tenés cuenta? Registrate</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
