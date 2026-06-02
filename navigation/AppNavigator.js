import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '@/config/colors';
import MovementScreen from '@/screens/MovementScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.card },
        headerTintColor: COLORS.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: COLORS.bg },
      }}
    >
      <Stack.Screen
        name="Movement"
        component={MovementScreen}
        options={{ title: 'Control de Movimiento' }}
      />
    </Stack.Navigator>
  );
}
