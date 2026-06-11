import { StyleSheet } from 'react-native';
import { COLORS, BUTTON, INPUT, TEXT, PAD } from '@/config/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: PAD.xl + PAD.md,
  },
  title: {
    ...TEXT.title,
    marginBottom: PAD.xs,
  },
  subtitle: {
    ...TEXT.subtitle,
    marginBottom: PAD.xl + PAD.md,
  },
  input: {
    ...INPUT,
    marginBottom: PAD.md,
  },
  error: {
    color: COLORS.red,
    fontSize: 13,
    marginBottom: PAD.md,
  },
  success: {
    color: COLORS.green,
    fontSize: 13,
    marginBottom: PAD.md,
  },
  btn: {
    ...BUTTON.primary,
    marginBottom: PAD.lg,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    ...TEXT.buttonLabel,
  },
  link: {
    color: COLORS.accent,
    fontSize: 14,
    textAlign: 'center',
  },
});
