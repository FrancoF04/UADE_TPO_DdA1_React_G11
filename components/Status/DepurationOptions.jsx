import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { colors, fontSizes } from '../../config/theme';
import { useRobot } from '../../hooks/useRobot'; // 1. Importar el hook

export default function DepurationOptions() {
    const { robot } = useRobot(); // 2. Obtener el estado del robot
    const [depurationData, setDepurationData] = useState(JSON.stringify({ status: "Depuration active" }, null, 2));

    useEffect(() => {
        // 3. Solo mostrar informativo si el robot no está conectado
        if (robot.isConnected !== 'Connected') {
            setDepurationData(JSON.stringify({ status: "Waiting for connection..." }, null, 2));
        } else {
            setDepurationData(JSON.stringify({ status: "Connected - Telemetry via HTTP fallback pending" }, null, 2));
        }
    }, [robot.isConnected]); // 4. El efecto ahora depende del estado de conexión

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