import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes } from '../config/theme';
import RobotButton from '../components/RobotButton';

export default function SelectRobotScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Your Robot</Text>
            <RobotButton title="G1" image={require('../assets/images/G1.png')}/>
            <RobotButton title="Go2" image={require('../assets/images/GO2.png')}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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