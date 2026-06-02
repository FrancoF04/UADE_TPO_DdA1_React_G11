import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

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
