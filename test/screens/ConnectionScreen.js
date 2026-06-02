import { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRobot } from '@/context/RobotContext';
import { useAuth } from '@/context/AuthContext';
import styles from './ConnectionScreen.styles';

const ROBOT_TYPES = [
  { id: 'go2', label: 'Go2', emoji: '🐕' },
  { id: 'g1', label: 'G1', emoji: '🤖' },
];

const STATUS_LABELS = {
  connected: 'Conectado',
  disconnected: 'Desconectado',
  error: 'Error',
};

export default function ConnectionScreen({ navigation }) {
  const { isConnected, robotType, connectionStatus, connect, disconnect, refreshStatus } = useRobot();
  const { logout } = useAuth();

  // Consulta /status al entrar a la pantalla para reflejar el estado real del servidor
  useFocusEffect(
    useCallback(() => {
      refreshStatus();
    }, [refreshStatus])
  );

  const [selectedType, setSelectedType] = useState('go2');
  const [networkInterface, setNetworkInterface] = useState('eth0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      await connect(selectedType, networkInterface);
    } catch (e) {
      setError(e.response?.data?.detail ?? 'No se pudo conectar al robot.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    setError(null);
    try {
      await disconnect();
    } catch (e) {
      setError(e.response?.data?.detail ?? 'No se pudo desconectar.');
    } finally {
      setLoading(false);
    }
  };

  const dotStyle =
    connectionStatus === 'connected'
      ? styles.statusConnected
      : connectionStatus === 'error'
        ? styles.statusError
        : styles.statusDisconnected;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Conexión</Text>
        <Text style={styles.subtitle}>Mock de Funcionalidad 1 — solo para testing</Text>

        {/* Status */}
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, dotStyle]} />
          <Text style={styles.statusText}>{STATUS_LABELS[connectionStatus] ?? connectionStatus}</Text>
          {robotType && (
            <Text style={styles.robotTypeText}>{robotType.toUpperCase()}</Text>
          )}
        </View>

        {/* Robot type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de robot</Text>
          <View style={styles.typeRow}>
            {ROBOT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[styles.typeBtn, selectedType === type.id && styles.typeBtnSelected]}
                onPress={() => setSelectedType(type.id)}
                disabled={isConnected || loading}
              >
                <Text style={styles.typeEmoji}>{type.emoji}</Text>
                <Text style={[styles.typeLabel, selectedType === type.id && styles.typeLabelSelected]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Network interface */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interfaz de red</Text>
          <TextInput
            style={styles.input}
            value={networkInterface}
            onChangeText={setNetworkInterface}
            placeholder="eth0"
            placeholderTextColor="#484f58"
            autoCapitalize="none"
            editable={!isConnected && !loading}
          />
        </View>

        {/* Connect / Disconnect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.connectBtn, (isConnected || loading) && styles.connectBtnDisabled]}
              onPress={handleConnect}
              disabled={isConnected || loading}
            >
              <Text style={styles.connectBtnText}>
                {loading && !isConnected ? 'Conectando...' : 'Conectar'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.disconnectBtn, (!isConnected || loading) && styles.connectBtnDisabled]}
              onPress={handleDisconnect}
              disabled={!isConnected || loading}
            >
              <Text style={styles.disconnectBtnText}>
                {loading && isConnected ? 'Desconectando...' : 'Desconectar'}
              </Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        {/* Navigate to MovementScreen */}
        <TouchableOpacity
          style={[styles.navBtn, !isConnected && styles.navBtnDisabled]}
          onPress={() => navigation.navigate('Movement')}
          disabled={!isConnected}
        >
          <Text style={styles.navBtnText}>Ir a Control de Movimiento →</Text>
        </TouchableOpacity>

        {/* Navigate to ActionsScreen */}
        <TouchableOpacity
          style={[styles.actionsBtn, !isConnected && styles.navBtnDisabled]}
          onPress={() => navigation.navigate('Actions')}
          disabled={!isConnected}
        >
          <Text style={styles.actionsBtnText}>Ir a Acciones →</Text>
        </TouchableOpacity>

        {/* Cerrar sesión — reemplazar con el botón real de Feature 5 */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutBtnText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
