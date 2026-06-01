import { View, Text, Image } from 'react-native';
import { colors, fontSizes } from '../config/theme';
import { StyleSheet } from 'react-native';

export default function RobotButton({ title, image }){
    return (
        <View style={styles.button}>
            <Image source={image} style={styles.image} />
            <Text style={styles.text}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 200,
        height: 200,
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
    image: {
        width: 100,
        height: 100,
        marginBottom: 16,
    },
    text: {
        fontSize: fontSizes.lg,
        color: colors.text,
        fontWeight: 'bold',
    },
});