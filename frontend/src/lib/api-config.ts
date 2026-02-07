// API Configuration
const BACKEND_BASE_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001/api'
    : process.env.BACKEND_URL || 'http://localhost:8001/api';

export const API_CONFIG = {
  BASE_URL: BACKEND_BASE_URL,
  TASKS_ENDPOINT: `${BACKEND_BASE_URL}/frontend/tasks`,  // Use frontend-compatible route
  CHAT_ENDPOINT: `${BACKEND_BASE_URL}/chat`,
};

export default API_CONFIG;