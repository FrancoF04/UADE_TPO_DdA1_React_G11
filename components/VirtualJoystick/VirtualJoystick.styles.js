import { StyleSheet } from 'react-native';
import { COLORS, BUTTON, PAD } from '@/config/styles';

export const JOYSTICK_RADIUS = 70;
export const KNOB_RADIUS = 24;

export default StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  hint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: PAD.lg,
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
    ...BUTTON.disabled,
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
    marginTop: PAD.sm,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});
