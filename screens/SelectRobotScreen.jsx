import { Text, View } from 'react-native';
import styles from './SelectRobotScreen.styles';
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

