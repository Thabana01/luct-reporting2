import api from './api';

export const reportService = {
  getReports: async (search = '') => {
    const response = await api.get(`/reports?search=${search}`);
    return response.data;
  },

  createReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  exportReports: async () => {
    const response = await api.get('/reports/export', { responseType: 'blob' });
    return response.data;
  }
};