import { StyleSheet } from 'react-native';
import { COLORS, CARD, TEXT, PAD } from '@/config/styles';

export default StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        ...CARD,
        marginBottom: PAD.sm + 2,
    },
    text: {
        fontSize: 13,
        color: COLORS.text,
    },
    label: {
        ...TEXT.label,
        fontSize: 13,
    },
});
