import { StyleSheet } from 'react-native';
import { COLORS, BUTTON, TEXT } from '@/config/styles';

export default StyleSheet.create({
  btn: {
    flex: 1,
    ...BUTTON.action,
    paddingVertical: 16,
  },
  disabled: {
    ...BUTTON.disabled,
  },
  emoji: {
    fontSize: 28,
  },
  label: {
    ...TEXT.buttonLabelSecondary,
    marginTop: 6,
  },
});
