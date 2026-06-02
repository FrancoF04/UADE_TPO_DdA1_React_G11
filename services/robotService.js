import { api } from './api';

export const robotService = {
  getStatus: () => api.get('/status'),

  move: (vx, vy, vyaw) => api.post('/move', { vx, vy, vyaw }),

  stop: () => api.post('/stop'),

  standup: () => api.post('/standup'),

  sitdown: () => api.post('/sitdown'),
};
