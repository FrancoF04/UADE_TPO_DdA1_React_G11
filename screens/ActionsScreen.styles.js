import { StyleSheet } from 'react-native';
import { COLORS } from '@/config/colors';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    gap: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  robotLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
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
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 16,
  },
  historyList: {
    gap: 6,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
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
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 12,
  },
});
