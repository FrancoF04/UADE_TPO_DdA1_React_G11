import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '@/config/colors';
import MovementScreen from '@/screens/MovementScreen';
import { useAuth } from '@/context/AuthContext';

// [TEST] Importar pantallas mock — borrar cuando Features 1, 5 y 6 estén integradas
import ConnectionScreen from '@/test/screens/ConnectionScreen';
import LoginScreen from '@/test/screens/LoginScreen';
import RegisterScreen from '@/test/screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.card },
        headerTintColor: COLORS.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: COLORS.bg },
      }}
    >
      {!isAuthenticated ? (
        // [TEST] Pantallas mock de Features 5 y 6 — reemplazar con las implementaciones reales
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Registrarse' }}
          />
        </>
      ) : (
        // Pantallas autenticadas
        <>
          {/* [TEST] ConnectionScreen mock de Feature 1 — reemplazar con la pantalla real */}
          <Stack.Screen
            name="Connection"
            component={ConnectionScreen}
            options={{ title: 'Conexión (Test)' }}
          />
          <Stack.Screen
            name="Movement"
            component={MovementScreen}
            options={{ title: 'Control de Movimiento' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
