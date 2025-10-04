// Page: Courses.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/courseService';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    credits: 4,
    stream: 'IT',
  });
  const [editCourseId, setEditCourseId] = useState(null); // track editing

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      const data = await courseService.getCourses();
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Create or update course
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCourseId) {
        await courseService.updateCourse(editCourseId, formData);
        alert('Course updated successfully!');
      } else {
        await courseService.createCourse(formData);
        alert('Course created successfully!');
      }
      setShowForm(false);
      setFormData({ course_code: '', course_name: '', credits: 4, stream: 'IT' });
      setEditCourseId(null);
      fetchCourses();
    } catch (error) {
      alert('Error saving course: ' + error.response?.data?.error || error.message);
    }
  };

  // Edit button click
  const handleEdit = (course) => {
    setFormData({
      course_code: course.course_code,
      course_name: course.course_name,
      credits: course.credits,
      stream: course.stream,
    });
    setEditCourseId(course.id);
    setShowForm(true);
  };

  // Delete button click
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await courseService.deleteCourse(id);
      fetchCourses();
    } catch (error) {
      alert('Error deleting course: ' + error.response?.data?.error || error.message);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <Header />
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        <Sidebar />
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          {/* Page Header */}
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Courses</h1>
            {user?.role === 'program_leader' && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setFormData({ course_code: '', course_name: '', credits: 4, stream: 'IT' });
                  setEditCourseId(null);
                  setShowForm(true);
                }}
              >
                <i className="bi bi-plus-circle me-1"></i> Add Course
              </button>
            )}
          </div>

          {/* Add/Edit Form */}
          {showForm && user?.role === 'program_leader' && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">{editCourseId ? 'Edit Course' : 'Add New Course'}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Course Code *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="course_code"
                        value={formData.course_code}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Course Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="course_name"
                        value={formData.course_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Credits</label>
                      <select className="form-select" name="credits" value={formData.credits} onChange={handleChange}>
                        {[2, 3, 4, 5, 6].map((c) => (
                          <option key={c} value={c}>{c} Credits</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Stream</label>
                      <select className="form-select" name="stream" value={formData.stream} onChange={handleChange}>
                        <option value="IT">Information Technology</option>
                        <option value="Business">Business</option>
                        <option value="Business IT">Business IT</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Design">Design</option>
                        <option value="Tourism">Tourism</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      {editCourseId ? 'Update Course' : 'Create Course'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowForm(false);
                        setEditCourseId(null);
                        setFormData({ course_code: '', course_name: '', credits: 4, stream: 'IT' });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Courses Table */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Available Courses</h5>
            </div>
            <div className="card-body">
              {courses.length === 0 ? (
                <p>No courses found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Stream</th>
                        <th>Credits</th>
                        {user?.role === 'program_leader' && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => (
                        <tr key={course.id}>
                          <td><strong>{course.course_code}</strong></td>
                          <td>{course.course_name}</td>
                          <td><span className="badge bg-primary">{course.stream}</span></td>
                          <td>{course.credits}</td>
                          {user?.role === 'program_leader' && (
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary" onClick={() => handleEdit(course)}>
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button className="btn btn-outline-danger" onClick={() => handleDelete(course.id)}>
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          )}
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

export default Courses;
