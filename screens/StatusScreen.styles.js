import { StyleSheet } from 'react-native';
import { COLORS, CARD, BUTTON, TEXT, PAD, SHADOW } from '@/config/styles';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingHorizontal: PAD.xl,
    },
    header: {
        marginTop: PAD.xl + PAD.lg,
        marginBottom: PAD.lg,
        width: '100%',
    },
    robotTitle: {
        ...TEXT.title,
        fontSize: 26,
        letterSpacing: 1,
    },
    separator: {
        height: 2,
        backgroundColor: COLORS.accent,
        width: 100,
        marginTop: PAD.sm,
    },
    statusSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...CARD,
        marginBottom: PAD.xl + PAD.md,
    },
    infoContainer: {
        flex: 1,
        marginRight: PAD.md - 2,
    },
    infoItem: {
        marginBottom: PAD.lg + PAD.md,
    },
    label: {
        ...TEXT.label,
    },
    images: {
        width: '40%',
        height: 120,
        resizeMode: 'contain',
    },
    depurationContainer: {
        flex: 1,
        marginBottom: PAD.lg,
    },
    actionsContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: PAD.xl + PAD.lg,
    },
    controlButton: {
        width: '100%',
        height: 50,
        ...BUTTON.primary,
        marginTop: PAD.md - 4,
    },
    actionsButton: {
        backgroundColor: COLORS.accentDark,
    },
    controlButtonText: {
        ...TEXT.title,
        color: COLORS.white,
        fontSize: 20,
    },
});
