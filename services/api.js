import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../config/api';
import { getAccessToken, clearSession } from '../utils/sessionStorage';

export const api = axios.create({ baseURL: API_BASE_URL, timeout: API_TIMEOUT });

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
