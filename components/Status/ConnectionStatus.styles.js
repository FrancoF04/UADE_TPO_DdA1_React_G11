import { StyleSheet } from 'react-native';
import { colors, fontSizes } from '../../config/theme';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 30,
        marginRight: 8,
    },
    statusText: {
        fontSize: fontSizes.lg,
        color: colors.text,
        flexShrink: 1,
    },
});
