import { View, Text } from 'react-native';
import styles from './FeedbackToast.styles';

export default function FeedbackToast({ message, success }) {
  if (!message) return null;

  return (
    <View style={[styles.container, success ? styles.success : styles.error]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
