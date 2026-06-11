import { StyleSheet } from 'react-native';
import { colors, fontSizes } from '../../config/theme';

export default StyleSheet.create({
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
