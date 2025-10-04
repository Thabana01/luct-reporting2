import axios from 'axios';

const API_URL = '/api/classes';

export const classesService = {
  // Fetch all classes
  getAllClasses: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  // Fetch a single class by ID
  getClassById: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  // OPTIONAL: If you later add a /faculties endpoint in the backend
  // getAllFaculties: async () => {
  //   const res = await axios.get(`${API_URL}/faculties`);
  //   return res.data; // Returns array of faculty names
  // }
};
