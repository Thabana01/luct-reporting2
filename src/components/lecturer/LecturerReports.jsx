// Lecturer Reports
import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import SearchBar from '../common/SearchBar';
import LoadingSpinner from '../common/LoadingSpinner';
import ReportForm from './ReportForm';
import { useAuth } from '../../context/AuthContext';
import { reportService } from '../../services/reportService';

const LecturerReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [searchTerm]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportService.getReports(searchTerm);
      setReports(data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await reportService.exportReports();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `my-reports-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting reports:', error);
      alert('Error exporting reports: ' + error.response?.data?.error);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <Header />
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <LoadingSpinner message="Loading your reports..." />
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
            <h1 className="h2">My Reports</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <button 
                className="btn btn-success me-2"
                onClick={handleExport}
              >
                <i className="bi bi-download me-1"></i>
                Export Excel
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setShowReportForm(true)}
              >
                <i className="bi bi-plus-circle me-1"></i>
                New Report
              </button>
            </div>
          </div>

          {showReportForm && (
            <div className="mb-4">
              <ReportForm
                onSuccess={() => {
                  setShowReportForm(false);
                  fetchReports();
                }}
                onCancel={() => setShowReportForm(false)}
              />
            </div>
          )}

          <SearchBar 
            onSearch={setSearchTerm}
            placeholder="Search your reports by course, class, or topic..."
          />

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Class</th>
                  <th>Week</th>
                  <th>Date</th>
                  <th>Attendance</th>
                  <th>Topic</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      {searchTerm ? 'No reports match your search' : 'No reports submitted yet'}
                      {!searchTerm && (
                        <div className="mt-2">
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => setShowReportForm(true)}
                          >
                            Create Your First Report
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.id}>
                      <td>
                        <strong>{report.course_code}</strong><br/>
                        <small className="text-muted">{report.course_name}</small>
                      </td>
                      <td>{report.class_name}</td>
                      <td>{report.week_of_reporting}</td>
                      <td>{new Date(report.date_of_lecture).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${
                          report.actual_students_present / report.total_registered_students > 0.7 
                            ? 'bg-success' 
                            : report.actual_students_present / report.total_registered_students > 0.5
                            ? 'bg-warning'
                            : 'bg-danger'
                        }`}>
                          {report.actual_students_present}/{report.total_registered_students}
                        </span>
                      </td>
                      <td>
                        <div className="text-truncate" style={{maxWidth: '200px'}}>
                          {report.topic_taught}
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-success">Submitted</span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary">
                            <i className="bi bi-eye"></i>
                          </button>
                          <button className="btn btn-outline-secondary">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-outline-info">
                            <i className="bi bi-graph-up"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Quick Stats */}
          {reports.length > 0 && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Report Statistics</h5>
                  </div>
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-md-3">
                        <h4>{reports.length}</h4>
                        <small className="text-muted">Total Reports</small>
                      </div>
                      <div className="col-md-3">
                        <h4>
                          {Math.round(reports.reduce((sum, report) => 
                            sum + (report.actual_students_present / report.total_registered_students), 0) / reports.length * 100)}%
                        </h4>
                        <small className="text-muted">Average Attendance</small>
                      </div>
                      <div className="col-md-3">
                        <h4>
                          {new Set(reports.map(report => report.course_code)).size}
                        </h4>
                        <small className="text-muted">Courses Covered</small>
                      </div>
                      <div className="col-md-3">
                        <h4>
                          {new Set(reports.map(report => report.class_name)).size}
                        </h4>
                        <small className="text-muted">Classes Taught</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LecturerReports;