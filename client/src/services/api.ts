import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds default
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('API Error: Request timed out');
    } else {
      console.error('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

// Project APIs
export const getAllProjects = () => api.get('/projects');
export const getFeaturedProjects = () => api.get('/projects/featured');
export const getProject = (id: string) => api.get(`/projects/${id}`);
export const createProject = (data: any) => api.post('/projects', data);
export const updateProject = (id: string, data: any) => api.put(`/projects/${id}`, data);
export const deleteProject = (id: string) => api.delete(`/projects/${id}`);

// Upload API — with longer timeout
export const uploadImage = (formData: FormData) => api.post('/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 60000, // 60 seconds for uploads
});

// Skill APIs
export const getAllSkills = () => api.get('/skills');
export const getSkillsByCategory = (category: string) => api.get(`/skills/category/${category}`);
export const createSkill = (data: any) => api.post('/skills', data);
export const updateSkill = (id: string, data: any) => api.put(`/skills/${id}`, data);
export const deleteSkill = (id: string) => api.delete(`/skills/${id}`);

// Experience APIs
export const getAllExperiences = () => api.get('/experiences');
export const createExperience = (data: any) => api.post('/experiences', data);
export const updateExperience = (id: string, data: any) => api.put(`/experiences/${id}`, data);
export const deleteExperience = (id: string) => api.delete(`/experiences/${id}`);

// Message APIs
export const sendMessage = (data: any) => api.post('/messages', data);
export const getAllMessages = () => api.get('/messages');
export const getMessage = (id: string) => api.get(`/messages/${id}`);
export const markMessageAsRead = (id: string) => api.put(`/messages/${id}/read`);
export const deleteMessage = (id: string) => api.delete(`/messages/${id}`);

// Auth APIs
export const login = (email: string, password: string) => api.post('/auth/login', { email, password });
export const register = (email: string, password: string) => api.post('/auth/register', { email, password });
export const getMe = () => api.get('/auth/me');