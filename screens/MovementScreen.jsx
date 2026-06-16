import { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRobot } from '@/context/RobotContext';
import { robotService } from '@/services/robotService';
import useHistory from '@/hooks/useHistory';
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
  const { isConnected: connectionStatus, robotType } = useRobot();
  const { addToHistory } = useHistory();
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

  const showFeedback = (message, success) => {
    setFeedback({ message, success, key: Date.now() });
  };

  const startDirectionalMove = (vx, vy, vyaw) => {
    if (!isConnected) return;
    robotService.move(vx, vy, vyaw).catch(console.error);
    const label = vx > 0 ? 'Mover: Adelante' : vx < 0 ? 'Mover: Atrás' : vyaw > 0 ? 'Giro: Izquierda' : 'Giro: Derecha';
    addToHistory(label, true);
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
    addToHistory('Stop', true);
  };

  const handleAction = async (action, label) => {
    try {
      await action();
      showFeedback(`${label}: OK`, true);
      addToHistory(label, true);
    } catch (e) {
      showFeedback(e.response?.data?.detail ?? `Error: ${label}`, false);
      addToHistory(`${label} (error)`, false);
    }
  };

  const handleJoystickMove = (vx, vy, vyaw) => {
    if (!isConnectedRef.current) return;
    robotService.move(vx, vy, vyaw).catch(console.error);
    const moving = Math.abs(vx) > 0.01 || Math.abs(vyaw) > 0.01 || Math.abs(vy) > 0.01;
    if (moving && !joystickMovingRef.current) {
      joystickMovingRef.current = true;
      const label = `Joystick: vx=${vx.toFixed(2)} vy=${vy.toFixed(2)} vyaw=${vyaw.toFixed(2)}`;
      addToHistory(label, true);
    }
  };

  const handleJoystickStop = () => {
    if (!isConnectedRef.current) return;
    robotService.stop().catch(console.error);
    if (joystickMovingRef.current) {
      joystickMovingRef.current = false;
      addToHistory('Joystick: stop', true);
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
