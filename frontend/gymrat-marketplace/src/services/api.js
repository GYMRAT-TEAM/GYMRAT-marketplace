// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
});

// Auto-attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('gymrat_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-redirect on 401 (token expired)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gymrat_token');
      localStorage.removeItem('gymrat_user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// ---- AUTH ----
export const signUp = (data) => API.post('/auth/register', data);
export const signIn = (data) => API.post('/auth/login', data);
export const apiGoogleAuth = (credential) => API.post('/auth/google', { credential });
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const upgradePlan = (plan, paymentMethod) => API.put('/auth/upgrade-plan', { plan, paymentMethod });
export const changePassword = (data) => API.put('/auth/password', data);
export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return API.post('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ---- PRODUCTS ----
export const getProducts = (params) => API.get('/products', { params });
// params can be: { search, category, minPrice, maxPrice, sort }
export const getProductById = (id) => API.get(`/products/${id}`);
export const getCategories = () => API.get('/products/categories');

// ---- ORDERS / PAYMENT ----
export const createPayPalOrder = (data) => API.post('/orders/create-paypal-order', data);
export const capturePayPalOrder = (data) => API.post('/orders/capture-paypal-order', data);
export const getMyOrders = () => API.get('/orders/my');
export const placeOrder = (data) => API.post('/orders/cart', data);
export const getOrderCount = () => API.get('/orders/count');

export default API;