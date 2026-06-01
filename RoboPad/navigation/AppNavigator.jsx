import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="#"
            screenOptions={{
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
        </Stack.Navigator>
    );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}