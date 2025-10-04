// pages/CourseManagement.jsx
import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';

const CourseManagement = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    credits: 4,
    stream: 'IT',
    program_leader_id: user?.id || null,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    setLoading(true);
    try {
      const storedCourses = JSON.parse(localStorage.getItem('courses')) || [];
      setCourses(storedCourses);
    } catch (err) {
      console.error('Error loading courses from localStorage:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveCourses = (newCourses) => {
    localStorage.setItem('courses', JSON.stringify(newCourses));
    setCourses(newCourses);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCourse = {
      ...formData,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };

    const updatedCourses = [...courses, newCourse];
    saveCourses(updatedCourses);

    alert('Course created successfully!');
    setFormData({
      course_code: '',
      course_name: '',
      credits: 4,
      stream: 'IT',
      program_leader_id: user?.id || null,
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    const updatedCourses = courses.filter(c => c.id !== id);
    saveCourses(updatedCourses);
    alert('Course deleted successfully!');
  };

  if (loading) return <div>Loading courses...</div>;

  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        <Sidebar />
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Course Management</h1>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>Add Course</button>
          </div>

          {showForm && (
            <div className="card mb-4">
              <div className="card-header"><h5>Add New Course</h5></div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label>Course Code *</label>
                      <input type="text" name="course_code" value={formData.course_code} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label>Course Name *</label>
                      <input type="text" name="course_name" value={formData.course_name} onChange={handleChange} className="form-control" required />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label>Credits</label>
                      <select name="credits" value={formData.credits} onChange={handleChange} className="form-select">
                        {[2, 3, 4, 5, 6].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label>Stream</label>
                      <select name="stream" value={formData.stream} onChange={handleChange} className="form-select">
                        {['IT','Business','Business IT','Fashion','Design','Tourism'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success me-2">Create Course</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header"><h5>Available Courses</h5></div>
            <div className="card-body">
              {courses.length === 0 ? (
                <p>No courses found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Credits</th>
                        <th>Stream</th>
                        <th>Program Leader</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map(course => (
                        <tr key={course.id}>
                          <td>{course.id}</td>
                          <td>{course.course_code}</td>
                          <td>{course.course_name}</td>
                          <td>{course.credits}</td>
                          <td>{course.stream}</td>
                          <td>{course.program_leader_id || 'N/A'}</td>
                          <td>{new Date(course.created_at).toLocaleString()}</td>
                          <td>
                            <button onClick={() => handleDelete(course.id)} className="btn btn-sm btn-danger">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseManagement;
