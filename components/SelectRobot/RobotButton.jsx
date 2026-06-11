import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './RobotButton.styles';
import { useNavigation } from '@react-navigation/native';
import { useRobot } from '../../hooks/useRobot';

export default function RobotButton({ title, image }) {
    const navigation = useNavigation();
    const { selectRobot } = useRobot();
    const handlePress = () => {
        selectRobot({ name: title.toLowerCase() });
        navigation.navigate('Status');
    }
    
    return (
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handlePress}>
            <View style={styles.imageWrapper}>
                <Image source={image} style={styles.image} />
            </View>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

