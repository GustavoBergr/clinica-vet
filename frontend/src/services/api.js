import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.error || 'Erro ao comunicar com o servidor';
    return Promise.reject(new Error(msg));
  }
);

// Tutores
export const tutoresAPI = {
  listar: (params) => api.get('/tutores', { params }),
  buscarPorId: (id) => api.get(`/tutores/${id}`),
  animais: (id) => api.get(`/tutores/${id}/animais`),
  criar: (data) => api.post('/tutores', data),
  atualizar: (id, data) => api.put(`/tutores/${id}`, data),
  deletar: (id) => api.delete(`/tutores/${id}`)
};

// Animais
export const animaisAPI = {
  listar: (params) => api.get('/animais', { params }),
  buscarPorId: (id) => api.get(`/animais/${id}`),
  criar: (data) => api.post('/animais', data),
  atualizar: (id, data) => api.put(`/animais/${id}`, data),
  deletar: (id) => api.delete(`/animais/${id}`)
};

// Consultas
export const consultasAPI = {
  listar: (params) => api.get('/consultas', { params }),
  buscarPorId: (id) => api.get(`/consultas/${id}`),
  criar: (data) => api.post('/consultas', data),
  atualizar: (id, data) => api.put(`/consultas/${id}`, data),
  deletar: (id) => api.delete(`/consultas/${id}`)
};

export default api;
