import { StyleSheet } from 'react-native';
import { COLORS } from '@/config/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: '#2d1a00',
    borderWidth: 1,
    borderColor: COLORS.yellow,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  text: {
    color: COLORS.yellow,
    fontSize: 13,
    lineHeight: 18,
  },
});
