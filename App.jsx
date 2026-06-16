import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from '@/navigation/AppNavigator';
import { COLORS } from '@/config/colors';
import { AuthProvider } from '@/context/AuthContext';
import { RobotProvider } from '@/context/RobotContext';
import { HistoryProvider } from '@/context/HistoryContext';

export default function App() {
  return (
    <AuthProvider>
      <RobotProvider>
        <HistoryProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor={COLORS.bg} />
            <AppNavigator />
          </NavigationContainer>
        </HistoryProvider>
      </RobotProvider>
    </AuthProvider>
  );
}
