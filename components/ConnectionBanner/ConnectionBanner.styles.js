import { StyleSheet } from 'react-native';
import { COLORS, RADIUS, PAD } from '@/config/styles';

export default StyleSheet.create({
  container: {
    backgroundColor: '#2d1a00',
    borderWidth: 1,
    borderColor: COLORS.yellow,
    borderRadius: RADIUS.sm,
    padding: PAD.md,
    marginBottom: PAD.md,
  },
  text: {
    color: COLORS.yellow,
    fontSize: 13,
    lineHeight: 18,
  },
});
