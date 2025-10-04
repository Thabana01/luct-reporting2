import api from './api';

const ratingService = {
  // Fetch all my ratings
  getMyRatings: async () => {
    try {
      const response = await api.get('/ratings?limit=50');
      return response.data; // contains { ratings: [...] }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      throw error;
    }
  },

  // Submit new rating
  addRating: async ({ report_id, rating, comment }) => {
    try {
      const response = await api.post('/ratings', {
        report_id,
        rating,
        comment,
        rating_type: "lecture"  // always lecture for now
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  }
};

export { ratingService };
