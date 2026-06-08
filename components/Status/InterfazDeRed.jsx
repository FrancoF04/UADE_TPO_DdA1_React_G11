import { colors, fontSizes } from '../../config/theme';
import { Text, StyleSheet } from 'react-native';
import { useRobot } from '../../hooks/useRobot';

export default function InterfazDeRed() {
    const { robot } = useRobot();
    const network = robot.NetworkInterface;
    
    const mensaje = network && network !== 'Connecting' && network !== 'Disconnected'
        ? network
        : 'No detectada';

    return (
        <Text style={styles.value}>{mensaje}</Text>
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