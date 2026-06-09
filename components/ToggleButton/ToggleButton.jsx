import { TouchableOpacity, Text, View } from 'react-native';
import styles from './ToggleButton.styles';

export default function ToggleButton({ label, active, disabled, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.btn, active && styles.active, disabled && styles.disabled]}
      disabled={disabled}
      onPress={onPress}
    >
      <View style={[styles.dot, active ? styles.dotOn : styles.dotOff]} />
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
      <Text style={[styles.state, active ? styles.stateOn : styles.stateOff]}>
        {active ? 'ON' : 'OFF'}
      </Text>
    </TouchableOpacity>
  );
}
