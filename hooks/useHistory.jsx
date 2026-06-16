import { useContext } from 'react';
import { HistoryContext, useHistoryContext } from '@/context/HistoryContext';
export { makeHistoryEntry } from '@/context/HistoryContext';

export default function useHistory() {
  return useHistoryContext();
}

export { HistoryContext };
