import { StyleSheet } from 'react-native';
import { colors, fontSizes } from '../../config/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
        width: '100%',
        padding: 20,
        borderRadius: 15,
        marginBottom: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    text: {
        fontSize: fontSizes.sm,
        color: colors.text,
    },
    label: {
        fontSize: fontSizes.sm,
        color: colors.textSecondary,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 1,
    },
});
