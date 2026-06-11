import { StyleSheet } from 'react-native';
import { COLORS, PAD, TEXT } from '@/config/styles';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    padding: PAD.lg,
    paddingBottom: PAD.xl + PAD.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: PAD.md,
  },
  headerLeft: {
    gap: PAD.xs / 2,
  },
  title: {
    ...TEXT.title,
    fontSize: 20,
  },
  robotLabel: {
    ...TEXT.subtitle,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusConnected: {
    backgroundColor: COLORS.green,
  },
  statusDisconnected: {
    backgroundColor: COLORS.red,
  },
  section: {
    marginTop: PAD.lg + PAD.md,
  },
  sectionTitle: {
    ...TEXT.sectionTitle,
  },
  actionRow: {
    flexDirection: 'row',
    gap: PAD.md - 2,
    marginBottom: PAD.md - 2,
  },
  loadingText: {
    ...TEXT.subtitle,
    textAlign: 'center',
    paddingVertical: PAD.lg,
  },
  historyList: {
    gap: PAD.xs - 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PAD.sm,
    paddingVertical: PAD.xs - 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historyDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  historyDotOk: {
    backgroundColor: COLORS.green,
  },
  historyDotErr: {
    backgroundColor: COLORS.red,
  },
  historyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  historyTime: {
    fontSize: 11,
    color: COLORS.disabled,
  },
  emptyHistory: {
    ...TEXT.subtitle,
    textAlign: 'center',
    paddingVertical: PAD.md,
  },
});
