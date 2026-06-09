import { View, Text } from 'react-native';
import styles from './ConnectionBanner.styles';

export default function ConnectionBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Robot no conectado. Conectalo desde la pantalla de conexión para habilitar los controles.
      </Text>
    </View>
  );
}
