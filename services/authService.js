import { api } from '@/services/api';

export const authService = {
  login: (identifier, password) =>
    api.post('/auth/token', { identifier, password }),
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
};
