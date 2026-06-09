import { useState, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRobot } from '@/context/RobotContext';
import { actionsService, TOGGLE_ENDPOINTS } from '@/services/actionsService';
import ActionButton from '@/components/ActionButton/ActionButton';
import ToggleButton from '@/components/ToggleButton/ToggleButton';
import FeedbackToast from '@/components/FeedbackToast/FeedbackToast';
import ConnectionBanner from '@/components/ConnectionBanner/ConnectionBanner';
import styles from './ActionsScreen.styles';

const ROBOT_LABELS = {
  go2: 'Go2 (cuadrúpedo)',
  g1: 'G1 (humanoide)',
};

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

function timestamp() {
  return new Date().toTimeString().slice(0, 8);
}

export default function ActionsScreen() {
  const { isConnected, robotType } = useRobot();
  const isActive = isConnected === 'Connected';

  const [actions, setActions] = useState([]);
  const [loadingActions, setLoadingActions] = useState(false);
  const [toggleStates, setToggleStates] = useState({});
  const [feedback, setFeedback] = useState({ message: null, success: false });
  const [history, setHistory] = useState([]);

  const robotTypeLower = robotType?.toLowerCase();

  const visibleToggles = TOGGLE_ENDPOINTS.filter(t =>
    t.robots.includes(robotTypeLower)
  );

  const showFeedback = (message, success) => {
    setFeedback({ message, success });
    setTimeout(() => setFeedback({ message: null, success: false }), 3000);
  };

  const addToHistory = (label, success) => {
    setHistory(prev =>
      [{ id: Date.now(), label, success, time: timestamp() }, ...prev].slice(0, 30)
    );
  };

  const loadActions = useCallback(async () => {
    if (!isActive) return;
    setLoadingActions(true);
    try {
      const { data } = await actionsService.getActions();
      setActions(data.actions ?? []);
    } catch {
      setActions([]);
    } finally {
      setLoadingActions(false);
    }
  }, [isActive]);

  useFocusEffect(
    useCallback(() => {
      loadActions();
      setToggleStates({});
    }, [loadActions])
  );

  const handleExecuteAction = async (name) => {
    try {
      await actionsService.executeAction(name);
      showFeedback(`${name}: OK`, true);
      addToHistory(name, true);
    } catch (e) {
      const msg = e.response?.data?.detail ?? `Error: ${name}`;
      showFeedback(msg, false);
      addToHistory(name, false);
    }
  };

  const handleToggle = async (key, label) => {
    const nextState = !toggleStates[key];
    try {
      await actionsService.toggleMode(key, nextState);
      setToggleStates(prev => ({ ...prev, [key]: nextState }));
      const stateLabel = `${label} ${nextState ? 'ON' : 'OFF'}`;
      showFeedback(`${stateLabel}: OK`, true);
      addToHistory(stateLabel, true);
    } catch (e) {
      const msg = e.response?.data?.detail ?? `Error: ${label}`;
      showFeedback(msg, false);
      addToHistory(`${label} (error)`, false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Acciones</Text>
            {robotType && (
              <Text style={styles.robotLabel}>{ROBOT_LABELS[robotTypeLower] ?? robotType}</Text>
            )}
          </View>
          <View style={[styles.statusDot, isActive ? styles.statusConnected : styles.statusDisconnected]} />
        </View>

        {!isActive && <ConnectionBanner />}

        <FeedbackToast message={feedback.message} success={feedback.success} />

        {/* Standard actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones estándar</Text>
          {loadingActions && (
            <Text style={styles.loadingText}>Cargando acciones...</Text>
          )}
          {!loadingActions && actions.length === 0 && isActive && (
            <Text style={styles.loadingText}>Sin acciones disponibles.</Text>
          )}
          {chunkArray(actions, 2).map((row, rowIdx) => (
            <View key={rowIdx} style={styles.actionRow}>
              {row.map(action => (
                <ActionButton
                  key={action}
                  label={action}
                  emoji="⚡"
                  disabled={!isActive}
                  onPress={() => handleExecuteAction(action)}
                />
              ))}
              {row.length === 1 && <View style={{ flex: 1 }} />}
            </View>
          ))}
        </View>

        {/* Toggle actions */}
        {visibleToggles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Modos especiales</Text>
            {chunkArray(visibleToggles, 2).map((row, rowIdx) => (
              <View key={rowIdx} style={styles.actionRow}>
                {row.map(t => (
                  <ToggleButton
                    key={t.key}
                    label={t.label}
                    active={!!toggleStates[t.key]}
                    disabled={!isActive}
                    onPress={() => handleToggle(t.key, t.label)}
                  />
                ))}
                {row.length === 1 && <View style={{ flex: 1 }} />}
              </View>
            ))}
          </View>
        )}

        {/* History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial de sesión</Text>
          {history.length === 0 ? (
            <Text style={styles.emptyHistory}>Sin acciones ejecutadas aún.</Text>
          ) : (
            <View style={styles.historyList}>
              {history.map(item => (
                <View key={item.id} style={styles.historyItem}>
                  <View style={[styles.historyDot, item.success ? styles.historyDotOk : styles.historyDotErr]} />
                  <Text style={styles.historyText}>{item.label}</Text>
                  <Text style={styles.historyTime}>{item.time}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
