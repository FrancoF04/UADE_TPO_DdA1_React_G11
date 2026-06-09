import { StyleSheet } from 'react-native';
import { COLORS } from '@/config/colors';

export const JOYSTICK_RADIUS = 70;
export const KNOB_RADIUS = 24;

export default StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  hint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  outer: {
    width: JOYSTICK_RADIUS * 2,
    height: JOYSTICK_RADIUS * 2,
    borderRadius: JOYSTICK_RADIUS,
    backgroundColor: COLORS.buttonBg,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerDisabled: {
    opacity: 0.35,
  },
  knob: {
    width: KNOB_RADIUS * 2,
    height: KNOB_RADIUS * 2,
    borderRadius: KNOB_RADIUS,
    backgroundColor: COLORS.accent,
  },
  knobDisabled: {
    backgroundColor: COLORS.disabled,
  },
  disabledText: {
    marginTop: 8,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});
