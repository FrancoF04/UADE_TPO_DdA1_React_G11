import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { colors, fontSizes } from '../../config/theme';
import { useRobot } from '../../hooks/useRobot';

export default function DepurationOptions() {
    const { robot, statusData } = useRobot();

    const depurationData = robot.isConnected === 'Connected' && statusData
        ? JSON.stringify(statusData, null, 2)
        : JSON.stringify('No robot connected', null, 2);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>DEPURATION OPTIONS</Text>
            <ScrollView showsVerticalScrollIndicator={true}>
                <Text style={styles.text}>{depurationData}</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
        width: '100%',
        padding: 20,
        borderRadius: 15,
        marginBottom: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    text: {
        fontSize: fontSizes.sm,
        color: colors.text,
    },
    label: {
        fontSize: fontSizes.sm,
        color: colors.textSecondary,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 1,
    },
});