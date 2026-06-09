import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '@/config/colors';
import { useAuth } from '@/context/AuthContext';
import SelectRobotScreen from '@/screens/SelectRobotScreen';
import StatusScreen from '@/screens/StatusScreen';
import MovementScreen from '@/screens/MovementScreen';
import ActionsScreen from '@/screens/ActionsScreen';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import ConectionStatus from '@/components/Status/ConectionStatus';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="SelectRobot"
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.card },
        headerTintColor: COLORS.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: COLORS.bg },
        headerRight: () => <ConectionStatus />,
        headerRightContainerStyle: { marginRight: 10 },
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Registrarse', headerRight: () => null }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="SelectRobot"
            component={SelectRobotScreen}
            options={{
              title: 'Seleccionar Robot',
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <ConectionStatus />
                  <TouchableOpacity onPress={logout}>
                    <Text style={{ color: COLORS.textSecondary, fontSize: 14 }}>Salir</Text>
                  </TouchableOpacity>
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="Status"
            component={StatusScreen}
            options={{ title: 'Estado del Robot' }}
          />
          <Stack.Screen
            name="Movement"
            component={MovementScreen}
            options={({ navigation }) => ({
              title: 'Control de Movimiento',
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <TouchableOpacity onPress={() => navigation.navigate('Actions')}>
                    <Text style={{ color: COLORS.accent, fontWeight: '600', fontSize: 14 }}>
                      Acciones
                    </Text>
                  </TouchableOpacity>
                  <ConectionStatus />
                </View>
              ),
            })}
          />
          <Stack.Screen
            name="Actions"
            component={ActionsScreen}
            options={{ title: 'Acciones' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
