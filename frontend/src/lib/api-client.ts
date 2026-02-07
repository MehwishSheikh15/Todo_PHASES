import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    // Ensure baseURL ends with a slash to properly resolve relative paths
    const normalizedBaseURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
    this.client = axios.create({
      baseURL: normalizedBaseURL,
    });

    // Request interceptor to attach JWT token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token expiration
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  get(path: string, params?: any) {
    return this.client.get(path, { params });
  }

  post(path: string, data?: any) {
    return this.client.post(path, data);
  }

  put(path: string, data?: any) {
    return this.client.put(path, data);
  }

  patch(path: string, data?: any) {
    return this.client.patch(path, data);
  }

  delete(path: string) {
    return this.client.delete(path);
  }
}

export default ApiClient;