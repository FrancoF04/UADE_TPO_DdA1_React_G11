import { StyleSheet } from 'react-native';
import { COLORS, BUTTON, PAD } from '@/config/styles';

export default StyleSheet.create({
  btn: {
    flex: 1,
    ...BUTTON.action,
    paddingVertical: 14,
    paddingHorizontal: PAD.sm,
    gap: 6,
  },
  active: {
    backgroundColor: COLORS.accentDark,
    borderColor: COLORS.accent,
  },
  disabled: {
    ...BUTTON.disabled,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOn: {
    backgroundColor: COLORS.green,
  },
  dotOff: {
    backgroundColor: COLORS.textSecondary,
  },
  label: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  labelActive: {
    color: COLORS.white,
  },
  state: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  stateOn: {
    color: COLORS.green,
  },
  stateOff: {
    color: COLORS.textSecondary,
  },
});
