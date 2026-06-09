import { StyleSheet } from 'react-native';
import { COLORS } from '@/config/colors';

export default StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
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
});
