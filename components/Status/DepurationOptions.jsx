import { StyleSheet,  View, ScrollView, Text } from 'react-native';
import { useState } from 'react';
import { colors, fontSizes } from '../../config/theme';
import DepurationOptionsButton from './DepurationOptionsButton';

export default function DepurationOptions() {
    const [DepurationOptions, setDepurationOptions] = useState('{"mode": "standing",\n"fsm_id": 200,\n"balance_mode": 0,\n"stand_height": 4294967295,\n"swing_height": 0.08,\n"body_height": 0.75,\n"position": { "x": 0.0, "y": 0.0, "z": 0.0 },\n"velocity": { "vx": 0.0, "vy": 0.0, "vyaw": 0.0 },\n"body_attitude": { "roll": 0.0, "pitch": 0.0, "yaw": 0.0 },\n"imu": {\n    "quaternion": [1.0, 0.0, 0.0, 0.0],\n    "gyroscope": [0.0, 0.0, 0.0],\n    "accelerometer": [0.01, -0.02, 9.81],\n    "rpy": [0.0, 0.0, 0.0],\n    "temperature": 38\n  },\n  "error_code": 0,\n  "battery": 92.0\n}');
    return (
        <View style={styles.container}>
            <Text style={styles.label}>DEPURATION OPTIONS</Text>
            <ScrollView>
                <Text style={styles.text}>{DepurationOptions}</Text>
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