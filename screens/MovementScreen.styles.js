import { StyleSheet } from 'react-native';
import { COLORS, CARD, BUTTON, TEXT, PAD } from '@/config/styles';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    padding: PAD.lg,
    paddingBottom: PAD.xl + PAD.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PAD.md,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    ...TEXT.title,
  },
  robotLabel: {
    ...TEXT.subtitle,
    marginTop: PAD.xs / 2,
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: PAD.lg - 4,
  },
  statusConnected: {
    backgroundColor: COLORS.green,
  },
  statusDisconnected: {
    backgroundColor: COLORS.textSecondary,
  },

  // Section
  section: {
    ...CARD,
    marginBottom: PAD.md,
  },
  sectionTitle: {
    ...TEXT.sectionTitle,
    marginBottom: PAD.lg - 2,
  },

  // D-Pad
  dpad: {
    alignItems: 'center',
    gap: PAD.xs - 2,
  },
  dpadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PAD.xs - 2,
  },
  dpadCenter: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtn: {
    width: 72,
    height: 72,
    ...BUTTON.danger,
  },
  stopBtnDisabled: {
    ...BUTTON.disabled,
  },
  stopBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.red,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Posture
  postureRow: {
    flexDirection: 'row',
    gap: PAD.md,
  },
});
