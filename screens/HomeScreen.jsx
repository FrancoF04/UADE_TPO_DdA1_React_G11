import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors, spacing, fontSizes } from '../config/theme';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const displayName = user?.username ?? user?.fullName ?? 'viajero';

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenido, {displayName}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SelectRobot')}>
        <Text style={styles.buttonText}>Seleccionar robot</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logout]} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  welcome: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 56,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  logout: {
    backgroundColor: colors.primaryDark,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: 'bold',
  },
});
