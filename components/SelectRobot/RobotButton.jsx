import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontSizes } from '../../config/theme';
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

const styles = StyleSheet.create({
    button: {
        flex: 1,
        height: '80%',
        backgroundColor: colors.surface,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 16,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    imageWrapper: {
        height: '70%',
        aspectRatio: 1,
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    text: {
        fontSize: fontSizes.lg,
        color: colors.text,
        fontWeight: 'bold',
    },
});