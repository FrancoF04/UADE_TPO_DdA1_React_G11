import { TouchableOpacity, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '@/config/colors';
import SelectRobotScreen from '@/screens/SelectRobotScreen';
import StatusScreen from '@/screens/StatusScreen';
import MovementScreen from '@/screens/MovementScreen';
import ActionsScreen from '@/screens/ActionsScreen';
import ConectionStatus from '@/components/Status/ConectionStatus';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
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
      <Stack.Screen
        name="SelectRobot"
        component={SelectRobotScreen}
        options={{ title: 'Seleccionar Robot' }}
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
    </Stack.Navigator>
  );
}
