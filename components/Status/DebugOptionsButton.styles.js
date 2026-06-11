import { StyleSheet } from 'react-native';
import { COLORS, BUTTON, TEXT, SHADOW, PAD } from '@/config/styles';

export default StyleSheet.create({
    button: {
        width: '100%',
        height: 50,
        ...BUTTON.action,
        marginTop: PAD.lg,
        ...SHADOW,
    },
    text: {
        ...TEXT.title,
        fontSize: 20,
    },
});
