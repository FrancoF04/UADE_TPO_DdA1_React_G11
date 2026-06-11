import { StyleSheet } from 'react-native';
import { COLORS, RADIUS, PAD, SHADOW, TEXT } from '@/config/styles';

export default StyleSheet.create({
    button: {
        flex: 1,
        height: '80%',
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.xl,
        justifyContent: 'center',
        alignItems: 'center',
        margin: PAD.lg,
        ...SHADOW,
    },
    imageWrapper: {
        height: '70%',
        aspectRatio: 1,
        marginBottom: PAD.lg,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    text: {
        ...TEXT.title,
        fontSize: 20,
    },
});
