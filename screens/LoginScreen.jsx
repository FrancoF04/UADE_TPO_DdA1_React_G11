import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors, spacing, fontSizes } from '../config/theme';

export default function LoginScreen({ navigation }) {
  const { login, pendingBiometric, loginWithBiometric, shouldOfferBiometric, enableBiometric, dismissBiometricOptIn } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (pendingBiometric) loginWithBiometric();
  }, [pendingBiometric]);

  const offerBiometricOptIn = async () => {
    if (!(await shouldOfferBiometric())) return;
    Alert.alert(
      '¿Activar ingreso con huella?',
      'La próxima vez que abras la app vas a poder ingresar con tu huella en lugar de escribir usuario y contraseña.',
      [
        { text: 'Ahora no', style: 'cancel', onPress: () => dismissBiometricOptIn() },
        { text: 'Activar', onPress: () => enableBiometric() },
      ]
    );
  };

  const onSubmit = async () => {
    const user = username.trim();
    const pass = password.trim();
    if (!user || !pass) {
      setError('Completá todos los campos');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await login(user, pass);
      await offerBiometricOptIn();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.appName}>XploreNow - G11</Text>
      <Text style={styles.subtitle}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>Ingresar</Text>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>¿No tenés cuenta? Registrate</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  appName: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.lg,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    height: 52,
    marginBottom: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: 'bold',
  },
  error: {
    color: colors.primaryDark,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  link: {
    color: colors.secondary,
    textAlign: 'center',
    marginTop: spacing.lg,
    fontSize: fontSizes.md,
  },
});
