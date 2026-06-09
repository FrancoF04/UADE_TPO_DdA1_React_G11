import { TouchableOpacity, Text } from 'react-native';
import styles from './ActionButton.styles';

export default function ActionButton({ label, emoji, disabled, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.btn, disabled && styles.disabled]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}
