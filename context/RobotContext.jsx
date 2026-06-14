import { createContext, useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import { connectionService } from '@/services/connectionService';

export const RobotContext = createContext();

const HEARTBEAT_INTERVAL = 5000;
const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

export function RobotProvider({ children }) {
  const [isConnected, setIsConnected] = useState('Disconnected');
  const [name, setName] = useState(null);
  const [networkInterface, setNetworkInterface] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const reconnectTimerRef = useRef(null);
  const heartbeatTimerRef = useRef(null);
  const isReconnectingRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const robotNameRef = useRef(null);

  useEffect(() => {
    reconnectAttemptsRef.current = reconnectAttempts;
  }, [reconnectAttempts]);

  useEffect(() => {
    robotNameRef.current = name;
  }, [name]);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const clearHeartbeatTimer = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
  }, []);

  const setConnectedState = useCallback((iface, data) => {
    isReconnectingRef.current = false;
    setReconnectAttempts(0);
    setIsConnected('Connected');
    setNetworkInterface(iface || null);
    setStatusData(data || null);
  }, []);

  const setErrorState = useCallback(() => {
    isReconnectingRef.current = false;
    setIsConnected('Error');
    setNetworkInterface(null);
  }, []);

  const setReconnectingState = useCallback(() => {
    isReconnectingRef.current = true;
    setIsConnected('Reconnecting');
  }, []);

  const attemptReconnect = useCallback(async () => {
    if (!robotNameRef.current || isReconnectingRef.current) return;
    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      setErrorState();
      return;
    }
    setReconnectingState();
    setReconnectAttempts(prev => prev + 1);
    try {
      await safeConnect(robotNameRef.current);
      const status = await connectionService.status();
      setConnectedState(status.data.network_interface, status.data);
    } catch (error) {
      const isNetworkError = !error.response;
      if (!isNetworkError) {
        setErrorState();
        return;
      }
      reconnectTimerRef.current = setTimeout(attemptReconnect, RECONNECT_DELAY);
    }
  }, [safeConnect, setErrorState, setReconnectingState, setConnectedState]);

  const selectRobot = useCallback((robot) => {
    setName(robot.name);
    setIsConnected('Disconnected');
    setNetworkInterface(null);
  }, []);

  const deselectRobot = useCallback(() => {
    clearHeartbeatTimer();
    clearReconnectTimer();
    isReconnectingRef.current = false;
    setReconnectAttempts(0);
    setStatusData(null);
    setName(null);
    setIsConnected('Disconnected');
    setNetworkInterface(null);
  }, [clearHeartbeatTimer, clearReconnectTimer]);

  const safeConnect = useCallback(async (robotName) => {
    try {
      await connectionService.connect(robotName);
      return;
    } catch (error) {
      // Si el backend dice que ya hay un robot conectado, forzar desconexión y reintentar
      if (error.response?.status !== 409) throw error;

      try {
        await connectionService.disconnect();
        await connectionService.connect(robotName);
      } catch (retryError) {
        throw retryError;
      }
    }
  }, []);

  const connectRobot = useCallback(async () => {
    clearReconnectTimer();
    setReconnectAttempts(0);
    isReconnectingRef.current = false;
    setIsConnected('Connecting');
    try {
      await safeConnect(robotNameRef.current);
      const status = await connectionService.status();
      setConnectedState(status.data.network_interface, status.data);
    } catch {
      setErrorState();
    }
  }, [safeConnect, clearReconnectTimer, setConnectedState, setErrorState]);

  const disconnectRobot = useCallback(async () => {
    clearHeartbeatTimer();
    clearReconnectTimer();
    isReconnectingRef.current = false;
    setReconnectAttempts(0);
    setStatusData(null);
    try {
      await connectionService.disconnect();
      setIsConnected('Disconnected');
      setNetworkInterface(null);
    } catch (error) {
      console.warn('[RobotContext] Disconnect error:', error.message || error);
    }
  }, [clearHeartbeatTimer, clearReconnectTimer]);

  const refreshStatus = useCallback(async () => {
    try {
      const { data } = await connectionService.status();
      if (data.connection_state === 'connected') {
        setConnectedState(data.network_interface, data);
        if (data.robot_type) setName(data.robot_type);
      } else {
        setIsConnected('Disconnected');
      }
    } catch {
      // silently fail
    }
  }, [setConnectedState]);

  useEffect(() => {
    return () => {
      clearHeartbeatTimer();
      clearReconnectTimer();
    };
  }, [clearHeartbeatTimer, clearReconnectTimer]);

  useEffect(() => {
    if (isConnected !== 'Connected') {
      clearHeartbeatTimer();
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await connectionService.status();
        const state = response?.data?.connection_state;

        if (state === 'connected') {
          setConnectedState(response.data.network_interface, response.data);
          return;
        }

        // El backend reporta desconectado: sincronizar estado local
        clearHeartbeatTimer();
        setIsConnected('Disconnected');
        setNetworkInterface(null);
        setStatusData(null);
      } catch (error) {
        // Error de red: no sabemos el estado real. Forzar desconexión y dejar que el usuario reconecte.
        clearHeartbeatTimer();
        try {
          await connectionService.disconnect();
        } catch {
          // Ignorar: si falló por red, el backend no recibió nada; si falló por estado, ya no estaba conectado
        }
        setIsConnected('Disconnected');
        setNetworkInterface(null);
        setStatusData(null);
      }
    };

    heartbeatTimerRef.current = setInterval(checkStatus, HEARTBEAT_INTERVAL);
    return () => clearHeartbeatTimer();
  }, [isConnected, setConnectedState, clearHeartbeatTimer]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const value = useMemo(() => ({
    isConnected,
    name,
    robotType: name,
    networkInterface,
    statusData,
    reconnectAttempts,
    selectRobot,
    deselectRobot,
    connectRobot,
    disconnectRobot,
    refreshStatus,
  }), [isConnected, name, networkInterface, statusData, reconnectAttempts, selectRobot, deselectRobot, connectRobot, disconnectRobot, refreshStatus]);

  return (
    <RobotContext.Provider value={value}>
      {children}
    </RobotContext.Provider>
  );
}

export function useRobot() {
  const ctx = useContext(RobotContext);
  if (!ctx) throw new Error('useRobot must be used within a <RobotProvider>');
  return ctx;
}
