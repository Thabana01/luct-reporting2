// frontend/src/services/api.js
import axios from "axios";

// Base URL for backend
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // JWT token stored on login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: intercept responses to catch errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optionally redirect to login if token expired
      console.warn("Unauthorized, token may have expired.");
    }
    return Promise.reject(error);
  }
);

export default api;
