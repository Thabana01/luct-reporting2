// Student Dashboard
import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { reportService } from '../../services/reportService';
import { ratingService } from '../../services/ratingService';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [recentReports, setRecentReports] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const [reportsData, ratingsData] = await Promise.all([
        reportService.getReports(),
        ratingService.getMyRatings()
      ]);
      setRecentReports(reportsData.reports?.slice(0, 5) || []);
      setMyRatings(ratingsData.ratings || []);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateReport = async (reportId, rating, comment) => {
    try {
      await ratingService.addRating({ report_id: reportId, rating, comment });
      fetchStudentData();
      alert('Rating submitted successfully!');
    } catch (error) {
      alert('Error submitting rating: ' + error.response?.data?.error);
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
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Student Dashboard</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <span className="badge bg-secondary me-2">
                Welcome, {user?.name}
              </span>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card text-white bg-primary">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="card-title">Available Reports</h5>
                      <h2 className="mb-0">{recentReports.length}</h2>
                    </div>
                    <i className="bi bi-file-text fs-1 opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-success">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="card-title">My Ratings</h5>
                      <h2 className="mb-0">{myRatings.length}</h2>
                    </div>
                    <i className="bi bi-star fs-1 opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-warning">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="card-title">Active Courses</h5>
                      <h2 className="mb-0">4</h2>
                    </div>
                    <i className="bi bi-journal-text fs-1 opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Recent Lecture Reports</h5>
                  <span className="badge bg-primary">
                    {recentReports.length} reports
                  </span>
                </div>
                <div className="card-body">
                  {recentReports.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-inbox fs-1 text-muted"></i>
                      <p className="text-muted mt-2">No recent reports available.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Course</th>
                            <th>Lecturer</th>
                            <th>Topic</th>
                            <th>Date</th>
                            <th>Attendance</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentReports.map((report) => {
                            const hasRated = myRatings.some(rating => rating.report_id === report.id);
                            return (
                              <tr key={report.id}>
                                <td>
                                  <strong>{report.course_code}</strong><br/>
                                  <small className="text-muted">{report.course_name}</small>
                                </td>
                                <td>{report.lecturer_name}</td>
                                <td className="text-truncate" style={{maxWidth: '200px'}} title={report.topic_taught}>
                                  {report.topic_taught}
                                </td>
                                <td>{new Date(report.date_of_lecture).toLocaleDateString()}</td>
                                <td>
                                  <span className={`badge ${
                                    report.actual_students_present / report.total_registered_students > 0.8 
                                      ? 'bg-success' 
                                      : report.actual_students_present / report.total_registered_students > 0.6 
                                      ? 'bg-warning' 
                                      : 'bg-danger'
                                  }`}>
                                    {report.actual_students_present}/{report.total_registered_students}
                                  </span>
                                </td>
                                <td>
                                  {hasRated ? (
                                    <span className="badge bg-success">
                                      <i className="bi bi-check-circle me-1"></i>
                                      Rated
                                    </span>
                                  ) : (
                                    <button 
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => handleRateReport(report.id, 5, 'Great lecture!')}
                                      title="Rate this lecture"
                                    >
                                      <i className="bi bi-star me-1"></i>
                                      Rate
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">Quick Actions</h6>
                  <div className="btn-group">
                    <button className="btn btn-outline-primary">
                      <i className="bi bi-eye me-1"></i>
                      View All Reports
                    </button>
                    <button className="btn btn-outline-success">
                      <i className="bi bi-star me-1"></i>
                      My Ratings
                    </button>
                    <button className="btn btn-outline-info">
                      <i className="bi bi-graph-up me-1"></i>
                      Monitoring
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;