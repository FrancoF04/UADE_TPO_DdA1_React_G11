import { createContext, useState, useRef, useEffect, useCallback, useContext, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRobot } from '@/context/RobotContext';
import { useAuth } from '@/context/AuthContext';

export const HistoryContext = createContext(null);

const SESSION_KEY = (username) => `sessionHistory_${username}`;
const PAST_KEY = (username) => `pastHistory_${username}`;
const PAST_HISTORY_LIMIT = 100;
const SESSION_HISTORY_LIMIT = 30;

let _idCounter = 0;

function makeHistoryId() {
  _idCounter = (_idCounter + 1) % 1_000_000;
  return `${Date.now()}-${_idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

function timestamp() {
  return new Date().toTimeString().slice(0, 8);
}

export function makeHistoryEntry(label, success) {
  return { id: makeHistoryId(), label, success, time: timestamp() };
}

function dedupeHistoryIds(items) {
  if (!Array.isArray(items) || items.length === 0) return items ?? [];
  const seen = new Set();
  return items.map((item, idx) => {
    let finalId = item?.id;
    if (!item || typeof finalId !== 'string') {
      finalId = makeHistoryId();
    } else if (seen.has(finalId)) {
      finalId = `${finalId}-${idx}`;
    }
    seen.add(finalId);
    return { ...item, id: finalId };
  });
}

export function HistoryProvider({ children }) {
  const { isConnected, connectionId } = useRobot();
  const { user } = useAuth();
  const username = user?.username ?? null;

  const [history, setHistory] = useState([]);
  const [pastHistory, setPastHistory] = useState([]);
  const [sessionHistoryLoaded, setSessionHistoryLoaded] = useState(false);
  const [pastHistoryLoaded, setPastHistoryLoaded] = useState(false);

  const historyRef = useRef(history);
  const usernameRef = useRef(username);
  const prevIsConnectedRef = useRef(isConnected);
  const initialFlushDoneRef = useRef(false);

  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { usernameRef.current = username; }, [username]);

  const savePastHistory = useCallback(async (newHistory) => {
    if (!username) return;
    try {
      await AsyncStorage.setItem(PAST_KEY(username), JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving past history:', error);
    }
  }, [username]);

  const saveSessionHistory = useCallback(async (newHistory) => {
    if (!username || !connectionId) return;
    try {
      await AsyncStorage.setItem(
        SESSION_KEY(username),
        JSON.stringify({ connectionId, history: newHistory })
      );
    } catch (error) {
      console.error('Error saving session history:', error);
    }
  }, [username, connectionId]);

  const flushStoredSessionHistory = useCallback(async () => {
    if (!username) return;
    try {
      const storedSession = await AsyncStorage.getItem(SESSION_KEY(username));
      if (!storedSession) return;

      const sessionData = JSON.parse(storedSession);
      const sessionItems = Array.isArray(sessionData?.history) ? sessionData.history : [];
      const storedPast = await AsyncStorage.getItem(PAST_KEY(username));
      const pastData = storedPast ? JSON.parse(storedPast) : [];
      const combined = dedupeHistoryIds([...sessionItems, ...pastData]).slice(0, PAST_HISTORY_LIMIT);
      await AsyncStorage.setItem(PAST_KEY(username), JSON.stringify(combined));
      await AsyncStorage.removeItem(SESSION_KEY(username));
      setPastHistory(combined);
      setHistory([]);
    } catch (error) {
      console.error('Error flushing stored session history:', error);
    }
  }, [username]);

  const flushCurrentSessionHistory = useCallback(async () => {
    const currentUsername = usernameRef.current;
    const currentHistory = historyRef.current;
    if (!currentUsername || currentHistory.length === 0) return;

    try {
      const stored = await AsyncStorage.getItem(PAST_KEY(currentUsername));
      const existingHistory = stored ? JSON.parse(stored) : [];
      const combined = dedupeHistoryIds([...currentHistory, ...existingHistory]).slice(0, PAST_HISTORY_LIMIT);
      await AsyncStorage.setItem(PAST_KEY(currentUsername), JSON.stringify(combined));
      await AsyncStorage.removeItem(SESSION_KEY(currentUsername));
      setPastHistory(combined);
      setHistory([]);
    } catch (error) {
      console.error('Error flushing session history:', error);
    }
  }, []);

  const loadSessionHistory = useCallback(async () => {
    if (!username) {
      setHistory([]);
      setSessionHistoryLoaded(true);
      return;
    }

    if (isConnected !== 'Connected') {
      setHistory([]);
      setSessionHistoryLoaded(true);
      return;
    }

    try {
      const stored = await AsyncStorage.getItem(SESSION_KEY(username));
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.connectionId !== connectionId) {
          await flushStoredSessionHistory();
          setHistory([]);
        } else {
          setHistory(dedupeHistoryIds(parsed.history ?? []));
        }
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Error loading session history:', error);
      setHistory([]);
    } finally {
      setSessionHistoryLoaded(true);
    }
  }, [username, isConnected, connectionId, flushStoredSessionHistory]);

  const loadPastHistory = useCallback(async () => {
    if (!username) return;
    try {
      const stored = await AsyncStorage.getItem(PAST_KEY(username));
      if (stored) {
        setPastHistory(dedupeHistoryIds(JSON.parse(stored)));
      }
    } catch (error) {
      console.error('Error loading past history:', error);
    } finally {
      setPastHistoryLoaded(true);
    }
  }, [username]);

  // Flush current session history only when the robot truly disconnects or errors out.
  useEffect(() => {
    const prev = prevIsConnectedRef.current;
    
    // Solo actuamos si hay una transición real de estado
    if (prev === isConnected) return;

    const isDisconnectState = isConnected === 'Disconnected' || isConnected === 'Error';

    if (prev === 'Connected' && isDisconnectState) {
      flushCurrentSessionHistory();
    }

    // Al conectarse, si veníamos de un estado no conectado, limpiamos la sesión actual
    // para empezar de cero (los comandos previos ya deberían estar en pastHistory)
    if (isConnected === 'Connected' && prev !== undefined && prev !== 'Connected') {
      setHistory([]);
    }

    prevIsConnectedRef.current = isConnected;
  }, [isConnected, flushCurrentSessionHistory]);

  // Flush de sesión huérfana al montar (solo una vez por username).
  // Maneja el caso de que la app se haya cerrado mientras el robot estaba conectado.
  useEffect(() => {
    if (!username || initialFlushDoneRef.current) return;
    initialFlushDoneRef.current = true;
    if (isConnected !== 'Connected') {
      flushStoredSessionHistory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  useEffect(() => {
    loadPastHistory();
    loadSessionHistory();
  }, [loadPastHistory, loadSessionHistory]);

  useEffect(() => {
    if (!pastHistoryLoaded) return;
    savePastHistory(pastHistory);
  }, [pastHistory, savePastHistory, pastHistoryLoaded]);

  useEffect(() => {
    if (!sessionHistoryLoaded) return;
    saveSessionHistory(history);
  }, [history, saveSessionHistory, sessionHistoryLoaded]);

  const addToHistory = useCallback((label, success) => {
    setHistory(prev =>
      [makeHistoryEntry(label, success), ...prev].slice(0, SESSION_HISTORY_LIMIT)
    );
  }, []);

  const value = useMemo(
    () => ({
      history,
      pastHistory,
      addToHistory,
      isLoaded: sessionHistoryLoaded && pastHistoryLoaded,
    }),
    [history, pastHistory, addToHistory, sessionHistoryLoaded, pastHistoryLoaded]
  );

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistoryContext() {
  const ctx = useContext(HistoryContext);
  if (!ctx) {
    throw new Error('useHistoryContext must be used within a HistoryProvider');
  }
  return ctx;
}
