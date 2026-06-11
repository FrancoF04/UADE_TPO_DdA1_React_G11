import { Text, TouchableOpacity } from 'react-native';
import styles from './ConnectionButton.styles';
import { useRobot } from '../../hooks/useRobot';

export default function ConnectionButton() {
    const { isConnected, connectRobot, disconnectRobot } = useRobot();
    const status = isConnected;

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


