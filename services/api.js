import axios from 'axios';
import { getAccessToken, clearSession } from '@/utils/sessionStorage';

const API_HOST = process.env.EXPO_PUBLIC_API_HOST;
const API_PORT = process.env.EXPO_PUBLIC_API_PORT;
const API_BASE_URL = `http://${API_HOST}:${API_PORT}`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const body = config.data ? ` | body: ${JSON.stringify(config.data)}` : '';
  console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}${body}`);
  return config;
});

// los interceptors viven fuera del arbol de React, el logout se inyecta desde el provider
export function setupInterceptors(onSessionExpired) {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        await clearSession();
        onSessionExpired();
      }
      return Promise.reject(error);
    }
  );
}
