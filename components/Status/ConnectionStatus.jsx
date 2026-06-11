import { Text, View } from 'react-native';
import { COLORS } from '@/config/colors';
import styles from './ConnectionStatus.styles';
import { useRobot } from '../../hooks/useRobot';

export default function ConnectionStatus() {
    const { isConnected, reconnectAttempts } = useRobot();
    const status = isConnected;

    const statusColors = {
        'Connected': COLORS.green,
        'Connecting': COLORS.yellow,
        'Reconnecting': COLORS.yellow,
        'Error': COLORS.red,
        'Disconnected': COLORS.red,
    };

    const backgroundColor = statusColors[status] || COLORS.white;

    const displayText = status === 'Reconnecting'
        ? `Reconnecting (${reconnectAttempts})`
        : status;

    return (
        <View style={styles.container}>
            <View style={[styles.statusIndicator, { backgroundColor }]} />
            <Text style={styles.statusText}>{displayText}</Text>
        </View>
    );
}

