import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const notesAPI = {
  getAllNotes: async () => {
    const response = await api.get('/notes/');
    return response.data;
  },

  getNote: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  createNote: async (noteData) => {
    const response = await api.post('/notes/', noteData);
    return response.data;
  },

  createNoteWithAI: async (noteData) => {
    const response = await api.post('/notes/ai', noteData);
    return response.data;
  },

  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  summarizeNote: async (id) => {
    const response = await api.post(`/notes/${id}/summarize`);
    return response.data;
  },

  categorizeNote: async (id) => {
    const response = await api.post(`/notes/${id}/categorize`);
    return response.data;
  },

  getKeyPoints: async (id) => {
    const response = await api.get(`/notes/${id}/key-points`);
    return response.data;
  },
};

export default api;
