import axios from "axios";

const API_URL = "http://localhost:5000/api/courses"; // backend endpoint

// Get all courses
const getCourses = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // returns array of courses
};

// Create a new course
const createCourse = async (courseData) => {
  const token = localStorage.getItem("token");

  const payload = {
    course_code: courseData.course_code,
    course_name: courseData.course_name,
    credits: courseData.credits,
    stream: courseData.stream,
    program_leader_id: courseData.program_leader_id || null,
  };

  const response = await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // returns created course
};

// Update a course
const updateCourse = async (id, updatedData) => {
  const token = localStorage.getItem("token");

  const payload = {
    course_code: updatedData.course_code,
    course_name: updatedData.course_name,
    credits: updatedData.credits,
    stream: updatedData.stream,
    program_leader_id: updatedData.program_leader_id || null,
  };

  const response = await axios.put(`${API_URL}/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // returns updated course
};

// Delete a course
const deleteCourse = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // returns success message
};

export const courseService = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
