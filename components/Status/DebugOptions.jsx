import { View, ScrollView, Text } from 'react-native';
import styles from './DebugOptions.styles';
import { useRobot } from '../../hooks/useRobot';

export default function DebugOptions() {
    const { isConnected, statusData } = useRobot();

    const debugData = isConnected === 'Connected' && statusData
        ? JSON.stringify(statusData, null, 2)
        : JSON.stringify('No robot connected', null, 2);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>DEPURATION OPTIONS</Text>
            <ScrollView showsVerticalScrollIndicator={true}>
                <Text style={styles.text}>{debugData}</Text>
            </ScrollView>
        </View>
    );
}

