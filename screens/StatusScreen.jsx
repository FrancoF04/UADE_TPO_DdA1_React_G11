import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes } from '../config/theme';
import { useRobot } from '../hooks/useRobot';

export default function StatusScreen() {
    const { robot } = useRobot();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Status Screen - {robot.name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    title: {
        fontSize: fontSizes.xl,
        color: colors.text,
        fontWeight: 'bold',
    },
});