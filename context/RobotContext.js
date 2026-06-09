import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { robotService } from '@/services/robotService';

const RobotContext = createContext(null);

export function RobotProvider({ children }) {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [robotType, setRobotType] = useState(null);

  const isConnected = connectionStatus === 'connected';

  const refreshStatus = useCallback(async () => {
    try {
      const { data } = await robotService.getStatus();
      setConnectionStatus(data.connection_state);
      setRobotType(data.robot_type);
    } catch {
      // No se pudo alcanzar el servidor
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const connect = async (type, networkInterface = 'eth0') => {
    const { data } = await api.post('/connect', {
      robot_type: type,
      network_interface: networkInterface,
    });
    setConnectionStatus('connected');
    setRobotType(type);
    return data;
  };

  const disconnect = async () => {
    await api.post('/disconnect');
    setConnectionStatus('disconnected');
    setRobotType(null);
  };

  return (
    <RobotContext.Provider value={{ isConnected, robotType, connectionStatus, connect, disconnect, refreshStatus }}>
      {children}
    </RobotContext.Provider>
  );
}

export function useRobot() {
  const ctx = useContext(RobotContext);
  if (!ctx) throw new Error('useRobot debe usarse dentro de <RobotProvider>');
  return ctx;
}
