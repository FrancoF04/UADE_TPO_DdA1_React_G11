import { StyleSheet } from 'react-native';
import { COLORS, RADIUS, PAD } from '@/config/styles';

export default StyleSheet.create({
  container: {
    borderRadius: RADIUS.sm,
    padding: PAD.sm + 2,
    marginBottom: PAD.md,
    overflow: 'hidden',
  },
  success: {
    backgroundColor: '#0f2d1a',
    borderWidth: 1,
    borderColor: COLORS.green,
  },
  error: {
    backgroundColor: '#2d0f0f',
    borderWidth: 1,
    borderColor: COLORS.red,
  },
  text: {
    color: COLORS.text,
    fontSize: 13,
  },
  progressBar: {
    height: 3,
    borderRadius: RADIUS.sm,
    marginTop: PAD.sm,
    alignSelf: 'flex-start',
  },
  progressSuccess: {
    backgroundColor: COLORS.green,
  },
  progressError: {
    backgroundColor: COLORS.red,
  },
});
