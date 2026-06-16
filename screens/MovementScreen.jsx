import { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRobot } from '@/context/RobotContext';
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { robotService } from '@/services/robotService';
import DirButton from '@/components/DirButton/DirButton';
import ActionButton from '@/components/ActionButton/ActionButton';
import VirtualJoystick from '@/components/VirtualJoystick/VirtualJoystick';
import FeedbackToast from '@/components/FeedbackToast/FeedbackToast';
import ConnectionBanner from '@/components/ConnectionBanner/ConnectionBanner';
import styles from './MovementScreen.styles';

const ROBOT_LABELS = {
  go2: 'Go2 (cuadrúpedo)',
  g1: 'G1 (humanoide)',
};

export default function MovementScreen() {
  const { isConnected: connectionStatus, robotType, connectionId } = useRobot();
  const { user } = useAuth();
  const username = user?.username ?? null;
  const isConnected = connectionStatus === 'Connected';
  const [feedback, setFeedback] = useState({ message: null, success: false, key: 0 });
  const moveIntervalRef = useRef(null);
  const isConnectedRef = useRef(isConnected);

  // Keep ref in sync so interval callbacks always see the latest value
  isConnectedRef.current = isConnected;

  // Stops the robot when navigating away from the screen (prevents uncontrolled movement)
  useFocusEffect(
    useCallback(() => {
      return () => {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
        if (isConnectedRef.current) robotService.stop().catch(console.error);
      };
    }, [])
  );

  const joystickMovingRef = useRef(false);

  function timestamp() {
    return new Date().toTimeString().slice(0, 8);
  }

  function makeHistoryId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function sessionHistoryStorageKey(username) {
    return `sessionHistory_${username}`;
  }

  const appendSessionEntry = useCallback(async (label, success = true) => {
    try {
      if (!username || !connectionId) return;
      const key = sessionHistoryStorageKey(username);
      const stored = await AsyncStorage.getItem(key);
      let parsed = null;
      if (stored) parsed = JSON.parse(stored);
      // If stored exists but belongs to another connection, replace it with current connection
      if (!parsed || parsed.connectionId !== connectionId) {
        parsed = { connectionId, history: [] };
      }
      const entry = { id: makeHistoryId(), label, success, time: timestamp() };
      parsed.history = [entry, ...(parsed.history || [])].slice(0, 100);
      await AsyncStorage.setItem(key, JSON.stringify(parsed));
    } catch (err) {
      console.error('[MovementScreen] appendSessionEntry error', err);
    }
  }, [username, connectionId]);

  const showFeedback = (message, success) => {
    setFeedback({ message, success, key: Date.now() });
  };

  const startDirectionalMove = (vx, vy, vyaw) => {
    if (!isConnected) return;
    robotService.move(vx, vy, vyaw).catch(console.error);
    // record directional start once per press
    const label = vx > 0 ? 'Mover: Adelante' : vx < 0 ? 'Mover: Atrás' : vyaw > 0 ? 'Giro: Izquierda' : 'Giro: Derecha';
    appendSessionEntry(label, true);
    moveIntervalRef.current = setInterval(() => {
      if (!isConnectedRef.current) return;
      robotService.move(vx, vy, vyaw).catch(console.error);
    }, 150);
  };

  const stopDirectionalMove = () => {
    clearInterval(moveIntervalRef.current);
    moveIntervalRef.current = null;
    if (!isConnectedRef.current) return;
    robotService.stop().catch(console.error);
    appendSessionEntry('Stop', true);
  };

  const handleAction = async (action, label) => {
    try {
      await action();
      showFeedback(`${label}: OK`, true);
      appendSessionEntry(label, true);
    } catch (e) {
      showFeedback(e.response?.data?.detail ?? `Error: ${label}`, false);
      appendSessionEntry(`${label} (error)`, false);
    }
  };

  const handleJoystickMove = (vx, vy, vyaw) => {
    if (!isConnectedRef.current) return;
    robotService.move(vx, vy, vyaw).catch(console.error);
    // only record start of joystick movement
    const moving = Math.abs(vx) > 0.01 || Math.abs(vyaw) > 0.01 || Math.abs(vy) > 0.01;
    if (moving && !joystickMovingRef.current) {
      joystickMovingRef.current = true;
      const label = `Joystick: vx=${vx.toFixed(2)} vy=${vy.toFixed(2)} vyaw=${vyaw.toFixed(2)}`;
      appendSessionEntry(label, true);
    }
  };

  const handleJoystickStop = () => {
    if (!isConnectedRef.current) return;
    robotService.stop().catch(console.error);
    if (joystickMovingRef.current) {
      joystickMovingRef.current = false;
      appendSessionEntry('Joystick: stop', true);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Control de Movimiento</Text>
            {robotType && (
              <Text style={styles.robotLabel}>{ROBOT_LABELS[robotType] ?? robotType}</Text>
            )}
          </View>
          <View style={[styles.statusDot, isConnected ? styles.statusConnected : styles.statusDisconnected]} />
        </View>

        {!isConnected && <ConnectionBanner />}

        <FeedbackToast message={feedback.message} success={feedback.success} trigger={feedback.key} />

        {/* D-Pad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dirección</Text>
          <View style={styles.dpad}>
            <View style={styles.dpadRow}>
              <DirButton
                label="↑"
                subtitle="Adelante"
                disabled={!isConnected}
                onPressIn={() => startDirectionalMove(0.5, 0, 0)}
                onPressOut={stopDirectionalMove}
              />
            </View>
            <View style={styles.dpadRow}>
              <DirButton
                label="←"
                subtitle="Girar izq."
                disabled={!isConnected}
                onPressIn={() => startDirectionalMove(0, 0, 0.99)}
                onPressOut={stopDirectionalMove}
              />
              <View style={styles.dpadCenter}>
                <TouchableOpacity
                  style={[styles.stopBtn, !isConnected && styles.stopBtnDisabled]}
                  disabled={!isConnected}
                  onPress={() => handleAction(robotService.stop, 'Stop')}
                >
                  <Text style={styles.stopBtnText}>■{'\n'}STOP</Text>
                </TouchableOpacity>
              </View>
              <DirButton
                label="→"
                subtitle="Girar der."
                disabled={!isConnected}
                onPressIn={() => startDirectionalMove(0, 0, -0.99)}
                onPressOut={stopDirectionalMove}
              />
            </View>
            <View style={styles.dpadRow}>
              <DirButton
                label="↓"
                subtitle="Atrás"
                disabled={!isConnected}
                onPressIn={() => startDirectionalMove(-0.5, 0, 0)}
                onPressOut={stopDirectionalMove}
              />
            </View>
          </View>
        </View>

        {/* Posture */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Postura</Text>
          <View style={styles.postureRow}>
            <ActionButton
              label="Pararse"
              emoji="🧍"
              disabled={!isConnected}
              onPress={() => handleAction(robotService.standup, 'Pararse')}
            />
            <ActionButton
              label="Sentarse"
              emoji="🪑"
              disabled={!isConnected}
              onPress={() => handleAction(robotService.sitdown, 'Sentarse')}
            />
          </View>
        </View>

        {/* Joystick */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Joystick</Text>
          <VirtualJoystick
            disabled={!isConnected}
            onMove={handleJoystickMove}
            onStop={handleJoystickStop}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
