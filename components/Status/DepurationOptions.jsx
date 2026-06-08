import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { colors, fontSizes } from '../../config/theme';
import { useRobot } from '../../hooks/useRobot';
import { conectionService } from '../../services/conectionService';

export default function DepurationOptions() {
    const { robot } = useRobot();
    const [depurationData, setDepurationData] = useState(JSON.stringify('loading', null, 2));

    useEffect(() => {
        const fetchData = async () => {
            if (robot.isConnected === 'Connected') {
                const data = await conectionService.status();
                setDepurationData(JSON.stringify(data.data, null, 2));
            } else {
                setDepurationData(JSON.stringify('No robot connected', null, 2));
            }
        };
        fetchData();
    }, [robot.isConnected]); 

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