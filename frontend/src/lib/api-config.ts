const BACKEND_BASE_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api'
    : process.env.BACKEND_URL || 'http://localhost:8000/api';

export const API_CONFIG = {
  BASE_URL: BACKEND_BASE_URL,
  AUTH_ENDPOINT: `${BACKEND_BASE_URL}/auth`,
  TASKS_ENDPOINT: `${BACKEND_BASE_URL}/frontend/tasks`,
  CHAT_ENDPOINT: `${BACKEND_BASE_URL}/chat`,
  ACTIVITY_ENDPOINT: `${BACKEND_BASE_URL}/activity`,
};

export default API_CONFIG;