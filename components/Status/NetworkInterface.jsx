import { Text } from 'react-native';
import styles from './NetworkInterface.styles';
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

