import { api } from './api';

function extractError(error, fallback) {
  if (error.response?.data?.error) return error.response.data.error;
  if (error.request) return 'Error de conexión. Verificá tu internet.';
  return fallback;
}

export async function login(username, password) {
  try {
    const { data } = await api.post('/auth/login', { username, password });
    const payload = data?.data ?? {};
    return {
      accessToken: payload.accessToken ?? payload.token,
      refreshToken: payload.refreshToken ?? payload.accessToken ?? payload.token,
    };
  } catch (error) {
    throw new Error(extractError(error, 'Ocurrió un error. Intentá de nuevo.'));
  }
}

export async function register({ username, email, password, fullName, phoneNumber }) {
  try {
    await api.post('/auth/register', { username, email, password, fullName, phoneNumber });
  } catch (error) {
    throw new Error(extractError(error, 'No se pudo crear la cuenta. Intentá de nuevo.'));
  }
}
