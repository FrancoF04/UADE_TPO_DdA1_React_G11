import { colors, fontSizes } from '../../config/theme';
import { Text, StyleSheet } from 'react-native';
import { useRobot } from '../../hooks/useRobot';

export default function NetworkInterface() {
    const { networkInterface } = useRobot();
    const network = networkInterface;
    
    const message = network && network !== 'Connecting' && network !== 'Disconnected'
        ? network
        : 'No detectada';

    return (
        <Text style={styles.value}>{message}</Text>
    );
}

const styles = StyleSheet.create({
    value: {
        fontSize: fontSizes.lg,
        color: colors.text,
        textAlign: 'left',
        flexShrink: 1,
    },
});