import { TouchableOpacity, Text } from "react-native";
import styles from './DebugOptionsButton.styles';

export default function DebugOptionsButton({ setDebugOptionsVisible }) {
    const handlePress = () => {
        setDebugOptionsVisible(prev => !prev);
    }

    return (
        <TouchableOpacity 
            style={styles.button}
            activeOpacity={0.8}
            onPress={handlePress}>
                <Text style={styles.text}>DEPURATION OPTIONS</Text>
        </TouchableOpacity>
    )
}

