import React, { useState, useEffect } from "react";
import axios from "axios";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    course_code: "",
    course_name: "",
    credits: 4,
    stream: "IT",
    program_leader_id: null,
  });

  // Fetch courses on page load
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleAddCourse = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/courses", newCourse);

      if (response.data.course) {
        // ✅ Add the new course directly to state so it appears immediately
        setCourses((prevCourses) => [...prevCourses, response.data.course]);
        alert("Course created successfully!");

        // Reset form
        setNewCourse({ course_code: "", course_name: "", credits: 4, stream: "IT", program_leader_id: null });
      }
    } catch (error) {
      console.error("Error creating course:", error.response?.data || error.message);
      alert("Error creating course");
    }
  };

  return (
    <div>
      <h2>Course Management</h2>

      {/* Add Course Form */}
      <div>
        <input
          type="text"
          placeholder="Course Code"
          value={newCourse.course_code}
          onChange={(e) => setNewCourse({ ...newCourse, course_code: e.target.value })}
        />
        <input
          type="text"
          placeholder="Course Name"
          value={newCourse.course_name}
          onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Credits"
          value={newCourse.credits}
          onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
        />
        <input
          type="text"
          placeholder="Stream"
          value={newCourse.stream}
          onChange={(e) => setNewCourse({ ...newCourse, stream: e.target.value })}
        />
        <input
          type="number"
          placeholder="Program Leader ID"
          value={newCourse.program_leader_id || ""}
          onChange={(e) => setNewCourse({ ...newCourse, program_leader_id: e.target.value })}
        />
        <button onClick={handleAddCourse}>Add Course</button>
      </div>

      {/* Course Table */}
      <h3>Course List</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Name</th>
            <th>Credits</th>
            <th>Stream</th>
            <th>Leader ID</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.course_code}</td>
              <td>{course.course_name}</td>
              <td>{course.credits}</td>
              <td>{course.stream}</td>
              <td>{course.program_leader_id || "N/A"}</td>
              <td>{new Date(course.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseManagement;
