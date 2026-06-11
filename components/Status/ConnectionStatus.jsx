import { Text, View } from 'react-native';
import styles from './ConnectionStatus.styles';
import { useRobot } from '../../hooks/useRobot';

export default function ConnectionStatus() {
    const { isConnected, reconnectAttempts } = useRobot();
    const status = isConnected;

    const statusColors = {
        'Connected': colors.connect,
        'Connecting': colors.warning,
        'Reconnecting': colors.warning,
        'Error': colors.error,
        'Disconnected': colors.disconnect,
    };

    const backgroundColor = statusColors[status] || colors.white;

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

