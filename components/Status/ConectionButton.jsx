import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, fontSizes } from '../../config/theme';
import { useRobot } from '../../hooks/useRobot';

export default function ConectionButton() {
    const { robot, connectRobot, disconnectRobot } = useRobot();
    const status = robot.isConnected;

    const buttonConfig = {
        'Connected': { label: 'DISCONNECT', color: colors.disconnect },
        'Connecting': { label: 'CONNECTING...', color: colors.connecting },
        'Disconnected': { label: 'CONNECT', color: colors.connect },
    };

    const { label, color } = buttonConfig[status] || buttonConfig['Disconnected'];

    const handlePress = () => {
        if (status === 'Connected') {
            disconnectRobot();
        } else {
            connectRobot();
        }
    };

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: color }]}
            activeOpacity={0.8}
            onPress={handlePress}
            disabled={status === 'Connecting'}
        >
            <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '90%',
        height: 50,
        backgroundColor: colors.connect,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    text: {
        fontSize: fontSizes.lg,
        color: colors.text,
        fontWeight: 'bold',
    },
});
