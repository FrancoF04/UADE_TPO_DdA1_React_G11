import { Text, StyleSheet, View } from 'react-native';
import { colors, fontSizes } from '../../config/theme';
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

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 30,
        marginRight: 8,
    },
    statusText: {
        fontSize: fontSizes.lg,
        color: colors.text,
        flexShrink: 1,
    },
});