import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api'
});

export const niveisService = {
  getAll: (params = {}) => api.get('/niveis', { params }),
  getById: (id) => api.get(`/niveis/${id}`),
  create: (data) => api.post('/niveis', data),
  update: (id, data) => api.put(`/niveis/${id}`, data),
  delete: (id) => api.delete(`/niveis/${id}`)
};

export const desenvolvedoresService = {
  getAll: (params = {}) => api.get('/desenvolvedores', { params }),
  getById: (id) => api.get(`/desenvolvedores/${id}`),
  create: (data) => api.post('/desenvolvedores', data),
  update: (id, data) => api.put(`/desenvolvedores/${id}`, data),
  delete: (id) => api.delete(`/desenvolvedores/${id}`)
};

export default api;