import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from '@/navigation/AppNavigator';
import { COLORS } from '@/config/colors';
import { AuthProvider } from '@/context/AuthContext';
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
