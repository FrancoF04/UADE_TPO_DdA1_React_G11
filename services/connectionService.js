import { api } from './api';

export const connectionService = {
    connect: (robot_type) => api.post('/connect', { robot_type }),

    disconnect: () => api.post('/disconnect'),
    
    status: () => api.get('/status'),
};