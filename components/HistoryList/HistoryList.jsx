import { View, Text, ScrollView } from 'react-native';
import styles from './HistoryList.styles';

const MAX_HEIGHT = 220;

export default function HistoryList({ title, items, emptyMessage }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.length === 0 ? (
        <Text style={styles.emptyHistory}>{emptyMessage}</Text>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator
          nestedScrollEnabled
        >
          {items.map(item => (
            <View key={item.id} style={styles.item}>
              <View
                style={[
                  styles.dot,
                  item.success ? styles.dotOk : styles.dotErr,
                ]}
              />
              <Text style={styles.label} numberOfLines={1}>
                {item.label}
              </Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
