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
    paddingVertical: 16,
  },
  disabled: {
    opacity: 0.35,
  },
  emoji: {
    fontSize: 28,
  },
  label: {
    fontSize: 13,
    color: COLORS.text,
    marginTop: 6,
    fontWeight: '600',
  },
});
