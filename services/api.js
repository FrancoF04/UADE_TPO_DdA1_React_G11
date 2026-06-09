import axios from 'axios';

const API_HOST = process.env.EXPO_PUBLIC_API_HOST;
const API_PORT = process.env.EXPO_PUBLIC_API_PORT;
const API_BASE_URL = `http://${API_HOST}:${API_PORT}`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const body = config.data ? ` | body: ${JSON.stringify(config.data)}` : '';
  console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}${body}`);
  return config;
});