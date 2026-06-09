import { createContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { conectionService } from '../services/conectionService';

export const RobotContext = createContext();

const HEARTBEAT_INTERVAL = 5000; // ms: cada cuánto consultamos /status
const RECONNECT_DELAY = 3000;    // ms: espera entre intentos de reconexión
const MAX_RECONNECT_ATTEMPTS = 5;

export const RobotProvider = ({ children }) => {
    // estados del context
    const [name, setName] = useState(null);
    const [isConnected, setIsConnected] = useState(null);
    const [networkInterface, setNetworkInterface] = useState(null);
    const [statusData, setStatusData] = useState(null);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    // estado combinado para facilitar uso en componentes
    const reconnectTimerRef = useRef(null);
    const heartbeatTimerRef = useRef(null);
    const isReconnectingRef = useRef(false);
    const reconnectAttemptsRef = useRef(0);
    const robotNameRef = useRef(null);

    // Sincronizar refs con estados para evitar dependencias en callbacks
    useEffect(() => {
        reconnectAttemptsRef.current = reconnectAttempts;
    }, [reconnectAttempts]);

    useEffect(() => {
        robotNameRef.current = robot.name;
    }, [robot.name]);

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

    const selectRobot = useCallback((robot) => {
        setName(robot.name);
        setIsConnected("Disconnected");
        setNetworkInterface(null);
    }, []);

    const deselectRobot = useCallback(() => {
        clearHeartbeatTimer();
        clearReconnectTimer();
        isReconnectingRef.current = false;
        setReconnectAttempts(0);
        setStatusData(null);
        setName(null);
        setIsConnected(null);
        setNetworkInterface(null);
    }, [clearHeartbeatTimer, clearReconnectTimer]);

    const setConnectedState = useCallback((networkInterface, newStatusData) => {
        isReconnectingRef.current = false;
        setReconnectAttempts(0);
        setIsConnected("Connected");
        setNetworkInterface(networkInterface || null);
        setStatusData(newStatusData || null);
    }, []);

    const setErrorState = useCallback(() => {
        isReconnectingRef.current = false;
        setIsConnected("Error");
        setNetworkInterface(null);
    }, []);

    const setReconnectingState = useCallback(() => {
        isReconnectingRef.current = true;
        setIsConnected("Reconnecting");
    }, []);

    const attemptReconnect = useCallback(async () => {
        if (!robotNameRef.current || isReconnectingRef.current) return;

        if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
            console.warn('[RobotContext] Máximo de reintentos de reconexión alcanzado');
            setErrorState();
            return;
        }

        setReconnectingState();
        setReconnectAttempts(prev => prev + 1);

        try {
            await conectionService.connect(robotNameRef.current);
            const status = await conectionService.status();
            setConnectedState(status.data.NetworkInterface, status.data);
        } catch (error) {
            console.warn(`[RobotContext] Reintento ${reconnectAttemptsRef.current + 1} fallido:`, error.message || error);
            reconnectTimerRef.current = setTimeout(() => {
                attemptReconnect();
            }, RECONNECT_DELAY);
        }
    }, [setErrorState, setReconnectingState, setConnectedState]);

    const connectRobot = useCallback(async () => {
        clearReconnectTimer();
        setReconnectAttempts(0);
        isReconnectingRef.current = false;

        setIsConnected("Connecting");

        try {
            await conectionService.connect(robotNameRef.current);
            const status = await conectionService.status();
            setConnectedState(status.data.NetworkInterface, status.data);
        } catch (error) {
            console.warn('[RobotContext] Mock server no disponible o error HTTP:', error.message || error);
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
            await conectionService.disconnect();
            setIsConnected("Disconnected");
            networkInterface(null);
        } catch (error) {
            console.warn('[RobotContext] Error al desconectar desde la API:', error.message || error);
        }
    }, [clearHeartbeatTimer, clearReconnectTimer]);

    // Cleanup en unmount: limpia todos los timers
    useEffect(() => {
        return () => {
            clearHeartbeatTimer();
            clearReconnectTimer();
        };
    }, [clearHeartbeatTimer, clearReconnectTimer]);

    // Heartbeat: detecta pérdida de conexión cuando está Connected
    useEffect(() => {
        if (robot.isConnected !== "Connected") {
            clearHeartbeatTimer();
            return;
        }

        const checkStatus = async () => {
            try {
                const response = await conectionService.status();
                const stillConnected = response?.data?.connected ?? true; // fallback si no hay campo
                if (!stillConnected) {
                    console.warn('[RobotContext] Heartbeat detectó desconexión, iniciando reconexión...');
                    clearHeartbeatTimer();
                    attemptReconnect();
                } else {
                    setStatusData(prev => {
                        const next = response.data;
                        // Solo actualiza si cambió algo (comparación por JSON para objetos planos)
                        if (JSON.stringify(prev) === JSON.stringify(next)) {
                            return prev;
                        }
                        return next;
                    });
                }
            } catch (error) {
                console.warn('[RobotContext] Heartbeat falló, iniciando reconexión...', error.message || error);
                clearHeartbeatTimer();
                attemptReconnect();
            }
        };

        heartbeatTimerRef.current = setInterval(checkStatus, HEARTBEAT_INTERVAL);

        return () => clearHeartbeatTimer();
    }, [robot.isConnected, attemptReconnect, clearHeartbeatTimer]);

    const value = useMemo(() => ({
        name,
        isConnected,
        networkInterface,
        statusData,
        reconnectAttempts,
        selectRobot,
        deselectRobot,
        connectRobot,
        disconnectRobot,
    }), [name, isConnected, networkInterface, statusData, networkInterface, selectRobot, deselectRobot, connectRobot, disconnectRobot]);

    return (
        <RobotContext.Provider value={value}>
            {children}
        </RobotContext.Provider>
    );
};

