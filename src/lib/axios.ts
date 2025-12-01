import axios from 'axios';

const baseURL = import.meta.env['VITE_API_BASE_URL'];

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
  }
);

export default apiClient;
