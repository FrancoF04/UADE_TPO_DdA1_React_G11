import { TouchableOpacity, Text } from 'react-native';
import styles from './DirButton.styles';

export default function DirButton({ label, subtitle, disabled, onPressIn, onPressOut }) {
  return (
    <TouchableOpacity
      style={[styles.btn, disabled && styles.disabled]}
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      delayPressIn={0}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}
