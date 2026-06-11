import { StyleSheet } from 'react-native';
import { COLORS, TEXT } from '@/config/styles';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
    },
    title: {
        ...TEXT.title,
        fontSize: 26,
    },
});
