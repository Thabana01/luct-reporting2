import api from './api';

export const monitoringService = {
  getActivities: async (search = '', page = 1, limit = 10) => {
    const response = await api.get(`/monitoring?search=${search}&page=${page}&limit=${limit}`);
    return response.data;
  },

  logActivity: async (activityData) => {
    const response = await api.post('/monitoring', activityData);
    return response.data;
  },

  getMyActivities: async () => {
    const response = await api.get('/monitoring/my');
    return response.data;
  }
};