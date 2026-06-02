import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from '@/navigation/AppNavigator';
import { COLORS } from '@/config/colors';

// [TEST] AuthProvider mock — reemplazar con el de Features 5 y 6
import { AuthProvider } from '@/context/AuthContext';
// [TEST] RobotProvider mock — reemplazar con los providers reales de Feature 1
import { RobotProvider } from '@/context/RobotContext';

export default function App() {
  return (
    <AuthProvider>
      <RobotProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor={COLORS.bg} />
          <AppNavigator />
        </NavigationContainer>
      </RobotProvider>
    </AuthProvider>
  );
}
