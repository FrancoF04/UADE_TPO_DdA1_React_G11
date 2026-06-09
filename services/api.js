import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});
