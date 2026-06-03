import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../config/api';
import {
  getAccessToken,
  getRefreshToken,
  saveSession,
  clearSession,
  getStoredUsername,
} from '../utils/sessionStorage';

export const api = axios.create({ baseURL: API_BASE_URL, timeout: API_TIMEOUT });

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// cliente aparte sin interceptors para que el refresh no dispare otro 401
const bareClient = axios.create({ baseURL: API_BASE_URL, timeout: API_TIMEOUT });

let refreshPromise = null;

export async function refreshSession() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return false;

  try {
    const { data } = await bareClient.post('/auth/refresh', { refreshToken });
    const payload = data?.data;
    if (!payload?.token && !payload?.accessToken) return false;

    await saveSession({
      accessToken: payload.accessToken ?? payload.token,
      refreshToken: payload.refreshToken ?? refreshToken,
      username: await getStoredUsername(),
    });
    return true;
  } catch {
    return false;
  }
}

export function setupInterceptors(onSessionExpired) {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;
      const status = error.response?.status;

      if (status === 401 && original && !original._retried) {
        original._retried = true;

        if (!refreshPromise) refreshPromise = refreshSession();
        const refreshed = await refreshPromise;
        refreshPromise = null;

        if (refreshed) {
          const token = await getAccessToken();
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        }

        await clearSession();
        onSessionExpired();
      }

      return Promise.reject(error);
    }
  );
}
