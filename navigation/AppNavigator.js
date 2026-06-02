import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '@/config/colors';
import MovementScreen from '@/screens/MovementScreen';

// [TEST] Importar la pantalla mock de Feature 1 — borrar cuando Feature 1 esté integrada
import ConnectionScreen from '@/test/screens/ConnectionScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      // [TEST] initialRouteName apunta al mock — reemplazar con la pantalla real de Feature 1
      initialRouteName="Connection"
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.card },
        headerTintColor: COLORS.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: COLORS.bg },
      }}
    >
      {/* [TEST] Pantalla mock de Feature 1 — reemplazar con las pantallas reales */}
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
    </Stack.Navigator>
  );
}
