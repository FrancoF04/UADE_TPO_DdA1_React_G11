import { StyleSheet } from 'react-native';
import { COLORS } from '@/config/colors';

export default StyleSheet.create({
  btn: {
    flex: 1,
    backgroundColor: COLORS.buttonBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 6,
  },
  active: {
    backgroundColor: COLORS.accentDark,
    borderColor: COLORS.accent,
  },
  disabled: {
    opacity: 0.35,
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
