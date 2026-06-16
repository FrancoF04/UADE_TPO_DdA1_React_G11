import { StyleSheet } from 'react-native';
import { COLORS, PAD, TEXT } from '@/config/styles';

const SCROLL_MAX_HEIGHT = 220;

export default StyleSheet.create({
  section: {
    marginTop: PAD.lg + PAD.md,
  },
  sectionTitle: {
    ...TEXT.sectionTitle,
  },
  scroll: {
    maxHeight: SCROLL_MAX_HEIGHT,
    backgroundColor: COLORS.bg,
    borderRadius: 6,
  },
  list: {
    gap: PAD.xs - 2,
    paddingBottom: PAD.xs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PAD.sm,
    paddingVertical: PAD.xs - 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotOk: {
    backgroundColor: COLORS.green,
  },
  dotErr: {
    backgroundColor: COLORS.red,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  time: {
    fontSize: 11,
    color: COLORS.white,
  },
  emptyHistory: {
    ...TEXT.subtitle,
    textAlign: 'center',
    paddingVertical: PAD.md,
  },
});
