import { StyleSheet } from 'react-native';
import { COLORS, BUTTON } from '@/config/styles';

export default StyleSheet.create({
  btn: {
    width: 72,
    height: 72,
    ...BUTTON.action,
  },
  disabled: {
    ...BUTTON.disabled,
  },
  label: {
    fontSize: 22,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
