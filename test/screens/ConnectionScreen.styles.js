import { StyleSheet } from 'react-native';
import { COLORS } from '@/config/colors';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 32,
  },

  // Status
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
    gap: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusConnected: { backgroundColor: COLORS.green },
  statusDisconnected: { backgroundColor: COLORS.textSecondary },
  statusError: { backgroundColor: COLORS.red },
  statusText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  robotTypeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 'auto',
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
    marginBottom: 12,
  },

  // Robot type selector
  typeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.buttonBg,
    alignItems: 'center',
    gap: 6,
  },
  typeBtnSelected: {
    borderColor: COLORS.accent,
    backgroundColor: '#0d2240',
  },
  typeEmoji: {
    fontSize: 26,
  },
  typeLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  typeLabelSelected: {
    color: COLORS.accent,
  },

  // Interface input
  input: {
    backgroundColor: COLORS.buttonBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },

  // Buttons
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  connectBtn: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  connectBtnDisabled: {
    opacity: 0.4,
  },
  connectBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
  disconnectBtn: {
    flex: 1,
    backgroundColor: '#3a0000',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.red,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disconnectBtnText: {
    color: COLORS.red,
    fontWeight: '700',
    fontSize: 14,
  },

  // Error
  errorBox: {
    backgroundColor: '#2d0f0f',
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 13,
  },

  // Nav button
  navBtn: {
    marginTop: 16,
    backgroundColor: COLORS.green,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  navBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
  logoutBtn: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
