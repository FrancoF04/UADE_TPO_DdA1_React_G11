import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from '@/navigation/AppNavigator';
import { COLORS } from '@/config/colors';

// [TEST] RobotProvider mock — reemplazar con los providers reales de Feature 1
import { RobotProvider } from '@/context/RobotContext';

export default function App() {
  return (
    // [TEST] Envolver con AuthProvider de Feature 1 cuando esté lista
    <RobotProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor={COLORS.bg} />
        <AppNavigator />
      </NavigationContainer>
    </RobotProvider>
  );
}
