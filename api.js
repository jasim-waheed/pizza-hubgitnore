import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const isAdminCall = config.url.startsWith('/inventory') || config.url.startsWith('/notifications') ||
    (config.url.startsWith('/orders') && config.method === 'get' && config.url === '/orders') ||
    (config.url.startsWith('/orders/') && config.url.endsWith('/status'));

  const adminToken = localStorage.getItem('pizzahub_admin_token');
  const userToken = localStorage.getItem('pizzahub_user_token');
  const token = isAdminCall ? adminToken : userToken || adminToken;

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
