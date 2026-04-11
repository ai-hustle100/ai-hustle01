import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ai_hustle_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ai_hustle_token');
      localStorage.removeItem('ai_hustle_user');
      // Only redirect if not already on auth page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  verifyOTP: (data: { email: string; otp: string }) =>
    api.post('/auth/verify-otp', data),
  resendOTP: (data: { email: string }) =>
    api.post('/auth/resend-otp', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () =>
    api.get('/auth/profile'),
};

// Profile completion API
export const profileAPI = {
  updatePhone: (data: { phone: string }) =>
    api.put('/auth/profile/phone', data),
  verifyPhone: (data: { otp: string }) =>
    api.put('/auth/profile/verify-phone', data),
  updateEducation: (data: { education: string; degreeType: string }) =>
    api.put('/auth/profile/education', data),
  updateSkills: (data: { skills: string[]; interests: string[] }) =>
    api.put('/auth/profile/skills', data),
  getCompletion: () =>
    api.get('/auth/profile/completion'),
};

// Platforms API
export const platformsAPI = {
  getAll: (params?: { category?: string; search?: string; sort?: string; page?: number }) =>
    api.get('/platforms', { params }),
  getById: (id: string) =>
    api.get(`/platforms/${id}`),
  toggleBookmark: (id: string) =>
    api.post(`/platforms/${id}/bookmark`),
  getBookmarks: () =>
    api.get('/platforms/bookmarks/list'),
};

// Subscribe API
export const subscribeAPI = {
  subscribe: (data: { email: string; source?: string }) =>
    api.post('/subscribe', data),
};

export default api;
