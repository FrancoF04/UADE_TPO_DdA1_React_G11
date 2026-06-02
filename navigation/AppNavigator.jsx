import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectRobotScreen from '../RoboPad/screens/SelectRobotScreen';
import { colors } from '../config/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="SelectRobot"
            screenOptions={{
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen
                name="SelectRobot"
                component={SelectRobotScreen}
                options={{ title: 'Select Your Robot' }}
            />
        </Stack.Navigator>
    );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}