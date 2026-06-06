import { colors, fontSizes } from '../../config/theme';
import { Text, StyleSheet } from 'react-native';
import { useRobot } from '../../hooks/useRobot';

export default function InterfazDeRed() {
    const { robot } = useRobot();
    const network = robot.NetworkInterface;
    
    const mensaje = network && network !== 'Connecting' && network !== 'Disconnected'
        ? `Interfaz de Red: ${network}`
        : 'No detectado';

    return (
        <Text style={styles.title}>{mensaje}</Text>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: fontSizes.lg,
        color: colors.text,
        textAlign: 'right',
        flexShrink: 1,
    },
});