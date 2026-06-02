import { StyleSheet } from 'react-native';
import { COLORS } from '@/config/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 32,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    color: COLORS.text,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  error: {
    color: COLORS.red,
    fontSize: 13,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
  link: {
    color: COLORS.accent,
    fontSize: 14,
    textAlign: 'center',
  },
});
