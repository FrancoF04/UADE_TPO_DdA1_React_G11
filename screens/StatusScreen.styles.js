import { StyleSheet } from 'react-native';
import { colors, fontSizes } from '../config/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
    },
    header: {
        marginTop: 40,
        marginBottom: 20,
        width: '100%',
    },
    robotTitle: {
        fontSize: fontSizes.xl,
        color: colors.text,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    separator: {
        height: 2,
        backgroundColor: colors.primary,
        width: 100,
        marginTop: 8,
    },
    statusSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        padding: 20,
        borderRadius: 15,
        marginBottom: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    infoContainer: {
        flex: 1,
        marginRight: 10,
    },
    infoItem: {
        marginBottom: 20,
    },
    label: {
        fontSize: fontSizes.sm - 2,
        color: colors.textSecondary,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 1,
    },
    images: {
        width: '40%',
        height: 120,
        resizeMode: 'contain',
    },
    depurationContainer: {
        flex: 1,
        marginBottom: 20,
    },
    actionsContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 40,
    },
    controlButton: {
        width: '100%',
        height: 50,
        backgroundColor: colors.primary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    actionsButton: {
        backgroundColor: colors.primaryDark,
    },
    controlButtonText: {
        fontSize: fontSizes.lg,
        color: colors.white,
        fontWeight: 'bold',
    },
});
