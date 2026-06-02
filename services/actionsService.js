import { api } from '@/services/api';

export const actionsService = {
  getActions: () => api.get('/actions'),
  executeAction: (name) => api.post(`/action/${name}`),
};
