import { TouchableOpacity, Text } from "react-native";
import styles from './DebugOptionsButton.styles';

export default function DebugOptionsButton({ isVisible, setDebugOptionsVisible }) {
    const handlePress = () => {
        setDebugOptionsVisible(prev => !prev);
    };

    const label = isVisible ? 'DESACTIVAR DEPURACIÓN' : 'ACTIVAR DEPURACIÓN';

    return (
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handlePress}>
                <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
    );
}
