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
});
