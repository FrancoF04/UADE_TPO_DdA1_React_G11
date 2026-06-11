import { useState, useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import styles from './FeedbackToast.styles';

const DURATION = 3000;

export default function FeedbackToast({ message, success, trigger }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }

    setVisible(true);
    progress.setValue(0);

    Animated.timing(progress, {
      toValue: 100,
      duration: DURATION,
      useNativeDriver: false,
    }).start();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, DURATION);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      progress.stopAnimation();
    };
  }, [message, success, trigger]);

  if (!visible) return null;

  const barWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['100%', '0%'],
  });

  const barColor = success ? styles.progressSuccess : styles.progressError;

  return (
    <View style={[styles.container, success ? styles.success : styles.error]}>
      <Text style={styles.text}>{message}</Text>
      <Animated.View style={[styles.progressBar, barColor, { width: barWidth }]} />
    </View>
  );
}
