import { StyleSheet } from 'react-native';
import { COLORS } from '@/config/colors';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  robotLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: 12,
  },
  statusConnected: {
    backgroundColor: COLORS.green,
  },
  statusDisconnected: {
    backgroundColor: COLORS.textSecondary,
  },

  // Section
  section: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 14,
  },

  // D-Pad
  dpad: {
    alignItems: 'center',
    gap: 6,
  },
  dpadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    backgroundColor: '#3a0000',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtnDisabled: {
    opacity: 0.35,
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
    gap: 12,
  },
});
