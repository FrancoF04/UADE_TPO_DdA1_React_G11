import { StyleSheet } from 'react-native';
import { colors, fontSizes } from '../../config/theme';

export default StyleSheet.create({
    button: {
        width: '100%',
        height: 50,
        backgroundColor: colors.surface,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    text: {
        fontSize: fontSizes.lg,
        color: colors.text,
        fontWeight: 'bold',
    },
});
