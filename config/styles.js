import { COLORS } from './colors';
export { COLORS } from './colors';

export const RADIUS = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
};

export const PAD = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

export const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 4,
};

export const BUTTON = {
  base: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  action: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  danger: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.red,
    backgroundColor: '#3a0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.35,
  },
};

export const CARD = {
  backgroundColor: COLORS.card,
  borderRadius: RADIUS.lg,
  padding: PAD.lg,
  ...SHADOW,
};

export const INPUT = {
  backgroundColor: COLORS.card,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: RADIUS.md,
  color: COLORS.text,
  paddingHorizontal: PAD.md,
  paddingVertical: PAD.md,
  fontSize: 15,
};

export const TEXT = {
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  buttonLabelSecondary: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },
  label: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 1,
  },
};
