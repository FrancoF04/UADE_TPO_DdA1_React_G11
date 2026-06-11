import { StyleSheet } from 'react-native';
import { COLORS, PAD } from '@/config/styles';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 30,
        marginRight: PAD.sm,
    },
    statusText: {
        fontSize: 20,
        color: COLORS.text,
        flexShrink: 1,
    },
});
