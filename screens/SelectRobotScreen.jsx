import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes } from '../config/theme';
import RobotButton from '../components/SelectRobot/RobotButton';
import { useImage } from '../hooks/useImage';

export default function SelectRobotScreen() {
    return (
        <View style={styles.container}>
            <RobotButton title="Go2" image={useImage('Go2')}/>
            <RobotButton title="G1" image={useImage('G1')}/>
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