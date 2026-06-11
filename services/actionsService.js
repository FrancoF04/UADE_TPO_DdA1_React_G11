import { api } from '@/services/api';

export const TOGGLE_ENDPOINTS = [
  { key: 'handstand',   label: 'Parado en manos', robots: ['go2'] },
  { key: 'freebound',   label: 'Free Bound',      robots: ['go2'] },
  { key: 'freeavoid',   label: 'Evasión libre',   robots: ['go2'] },
  { key: 'crossstep',   label: 'Paso cruzado',    robots: ['go2', 'g1'] },
  { key: 'walkupright', label: 'Caminar erguido', robots: ['g1'] },
];

export const actionsService = {
  getActions: () => api.get('/actions'),
  executeAction: (name) => api.post(`/action/${name}`),
  toggleMode: (endpoint, enable) => api.post(`/${endpoint}`, { enable }),
};
