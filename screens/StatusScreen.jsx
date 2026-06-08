import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes } from '../config/theme';
import { useRobot } from '../hooks/useRobot';
import InterfazDeRed from '../components/Status/InterfazDeRed';
import ConectionButton from '../components/Status/ConectionButton';
import ConectionStatus from '../components/Status/ConectionStatus';
import DeporationOptions from '../components/Status/DepurationOptions';

export default function StatusScreen() {
    return (
        <View style={styles.container}>
            <View>
                <View style={styles.statusContainer}>
                    <ConectionStatus />
                    <InterfazDeRed />
                </View>
                <ConectionButton />
            </View>
            <DeporationOptions />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    statusContainer: {
        marginTop: 25,
        marginBottom: 15,
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: fontSizes.xl,
        color: colors.text,
        fontWeight: 'bold',
    },
});