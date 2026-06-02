import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from '@/navigation/AppNavigator';
import { COLORS } from '@/config/colors';

// RobotProvider will be added by the Feature 1 team alongside AuthProvider
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={COLORS.bg} />
      <AppNavigator />
    </NavigationContainer>
  );
}
