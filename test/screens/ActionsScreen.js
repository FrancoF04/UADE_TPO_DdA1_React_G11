import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRobot } from '@/context/RobotContext';
import { actionsService } from '@/services/actionsService';
import FeedbackToast from '@/components/FeedbackToast/FeedbackToast';
import ConnectionBanner from '@/components/ConnectionBanner/ConnectionBanner';
import styles from './ActionsScreen.styles';

const formatTime = (date) =>
  date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export default function ActionsScreen() {
  const { isConnected } = useRobot();
  const [actions, setActions] = useState([]);
  const [loadingActions, setLoadingActions] = useState(false);
  const [feedback, setFeedback] = useState({ message: null, success: false });
  const [history, setHistory] = useState([]);
  const [executing, setExecuting] = useState(null);

  useEffect(() => {
    if (!isConnected) {
      setActions([]);
      return;
    }
    const load = async () => {
      setLoadingActions(true);
      try {
        const { data } = await actionsService.getActions();
        setActions(data.actions ?? []);
      } catch {
        setActions([]);
      } finally {
        setLoadingActions(false);
      }
    };
    load();
  }, [isConnected]);

  const showFeedback = (message, success) => {
    setFeedback({ message, success });
    setTimeout(() => setFeedback({ message: null, success: false }), 3000);
  };

  const handleAction = async (name) => {
    setExecuting(name);
    try {
      await actionsService.executeAction(name);
      setHistory((prev) => [{ name, success: true, timestamp: new Date() }, ...prev]);
      showFeedback(`${name}: OK`, true);
    } catch (e) {
      setHistory((prev) => [{ name, success: false, timestamp: new Date() }, ...prev]);
      showFeedback(e.response?.data?.detail ?? `Error: ${name}`, false);
    } finally {
      setExecuting(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {!isConnected && <ConnectionBanner />}
        <FeedbackToast message={feedback.message} success={feedback.success} />

        {/* Grid de acciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones disponibles</Text>

          {loadingActions && (
            <ActivityIndicator color="#2188ff" style={{ marginVertical: 16 }} />
          )}

          {!loadingActions && !isConnected && (
            <Text style={styles.emptyText}>Conectá el robot para ver las acciones.</Text>
          )}

          {!loadingActions && isConnected && actions.length === 0 && (
            <Text style={styles.emptyText}>No hay acciones disponibles.</Text>
          )}

          <View style={styles.grid}>
            {actions.map((name) => (
              <TouchableOpacity
                key={name}
                style={[
                  styles.actionBtn,
                  (!isConnected || executing !== null) && styles.actionBtnDisabled,
                ]}
                disabled={!isConnected || executing !== null}
                onPress={() => handleAction(name)}
              >
                {executing === name
                  ? <ActivityIndicator size="small" color="#2188ff" />
                  : <Text style={styles.actionBtnText}>{name}</Text>
                }
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Historial */}
        {history.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historial de comandos</Text>
            {history.map((entry, i) => (
              <View key={i} style={styles.historyRow}>
                <View style={[styles.historyDot, entry.success ? styles.dotSuccess : styles.dotError]} />
                <Text style={styles.historyName}>{entry.name}</Text>
                <Text style={styles.historyTime}>{formatTime(entry.timestamp)}</Text>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
