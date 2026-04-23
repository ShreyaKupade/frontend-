import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('phoenix_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const projectsAPI = {
  getAll: (params) => API.get('/projects', { params }),
  getOne: (id) => API.get(`/projects/${id}`),
  create: (data) => API.post('/projects', data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  delete: (id) => API.delete(`/projects/${id}`),
  upvote: (id) => API.post(`/projects/${id}/upvote`),
  getMy: () => API.get('/projects/my'),
};

export const commentsAPI = {
  get: (projectId) => API.get(`/comments/${projectId}`),
  add: (projectId, text) => API.post(`/comments/${projectId}`, { text }),
  delete: (id) => API.delete(`/comments/${id}`),
};

export const contributionsAPI = {
  get: (projectId) => API.get(`/contributions/${projectId}`),
  add: (projectId, data) => API.post(`/contributions/${projectId}`, data),
  updateStatus: (id, status) => API.put(`/contributions/${id}/status`, { status }),
};

export default API;
