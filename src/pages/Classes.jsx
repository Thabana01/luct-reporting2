import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SearchBar from '../components/common/SearchBar';
import { useAuth } from '../context/AuthContext';
import { classesService } from '../services/classesService'; // Ensure this service exists

const Classes = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('all');

  useEffect(() => {
    fetchClasses();
  }, [searchTerm, facultyFilter]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await classesService.getAllClasses();

      let filtered = data;
      if (searchTerm) {
        filtered = filtered.filter(c =>
          c.class_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.faculty_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (facultyFilter !== 'all') {
        filtered = filtered.filter(c => c.faculty_name === facultyFilter);
      }

      setClasses(filtered);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <Header />
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <LoadingSpinner message="Loading classes..." />
          </main>
        </div>
      </div>
    );
  }

  const facultyOptions = ['all', ...new Set(classes.map(c => c.faculty_name))];

  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        <Sidebar />
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Classes</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <span className="badge bg-primary fs-6">{classes.length} classes</span>
            </div>
          </div>

          {/* Search and filter */}
          <div className="row mb-4">
            <div className="col-md-6">
              <SearchBar
                onSearch={setSearchTerm}
                placeholder="Search by class code or faculty..."
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Filter by Faculty</label>
              <select
                className="form-select"
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
              >
                {facultyOptions.map(faculty => (
                  <option key={faculty} value={faculty}>{faculty}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Classes table */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Class List</h5>
            </div>
            <div className="card-body table-responsive">
              {classes.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-info-circle fs-1 mb-2"></i>
                  <p>No classes found.</p>
                </div>
              ) : (
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Class Code</th>
                      <th>Faculty</th>
                      <th>Total Students</th>
                      <th>Venue</th>
                      <th>Scheduled Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((c, index) => (
                      <tr key={c.id}>
                        <td>{index + 1}</td>
                        <td>{c.class_code}</td>
                        <td>{c.faculty_name}</td>
                        <td>{c.total_registered_students}</td> {/* Correct column */}
                        <td>{c.venue}</td>
                        <td>{c.scheduled_time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Classes;
