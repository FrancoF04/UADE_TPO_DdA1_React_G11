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
  const [connectionId, setConnectionId] = useState(null);
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

  const generateConnectionId = useCallback(() => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, []);

  const setConnectedState = useCallback((iface, data) => {
    isReconnectingRef.current = false;
    setReconnectAttempts(0);
    setIsConnected('Connected');
    setNetworkInterface(iface || null);
    setStatusData(data || null);
    setConnectionId(prev => prev ?? generateConnectionId());
  }, [generateConnectionId]);

  const setErrorState = useCallback(() => {
    isReconnectingRef.current = false;
    setIsConnected('Error');
    setNetworkInterface(null);
    setConnectionId(null);
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
      await connectionService.connect(robotNameRef.current);
      const status = await connectionService.status();
      setConnectedState(status.data.network_interface, status.data);
    } catch {
      reconnectTimerRef.current = setTimeout(attemptReconnect, RECONNECT_DELAY);
    }
  }, [setErrorState, setReconnectingState, setConnectedState]);

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
    setConnectionId(null);
    setIsConnected('Disconnected');
    setNetworkInterface(null);
  }, [clearHeartbeatTimer, clearReconnectTimer]);

  const connectRobot = useCallback(async () => {
    clearReconnectTimer();
    setReconnectAttempts(0);
    isReconnectingRef.current = false;
    setIsConnected('Connecting');
    try {
      await connectionService.connect(robotNameRef.current);
      const status = await connectionService.status();
      setConnectedState(status.data.network_interface, status.data);
    } catch {
      setErrorState();
    }
  }, [clearReconnectTimer, setConnectedState, setErrorState]);

  const disconnectRobot = useCallback(async () => {
    clearHeartbeatTimer();
    clearReconnectTimer();
    isReconnectingRef.current = false;
    setReconnectAttempts(0);
    setStatusData(null);
    try {
      await connectionService.disconnect();
      setConnectionId(null);
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
        setConnectionId(null);
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
        const stillConnected = response?.data?.connection_state === 'connected';
        if (!stillConnected) {
          clearHeartbeatTimer();
          attemptReconnect();
        } else {
          setStatusData(prev => {
            const next = response.data;
            if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
            return next;
          });
        }
      } catch {
        clearHeartbeatTimer();
        attemptReconnect();
      }
    };
    heartbeatTimerRef.current = setInterval(checkStatus, HEARTBEAT_INTERVAL);
    return () => clearHeartbeatTimer();
  }, [isConnected, attemptReconnect, clearHeartbeatTimer]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const value = useMemo(() => ({
    isConnected,
    name,
    robotType: name,
    connectionId,
    networkInterface,
    statusData,
    reconnectAttempts,
    selectRobot,
    deselectRobot,
    connectRobot,
    disconnectRobot,
    refreshStatus,
  }), [isConnected, name, connectionId, networkInterface, statusData, reconnectAttempts, selectRobot, deselectRobot, connectRobot, disconnectRobot, refreshStatus]);

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
