// Page: Reports.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import ReportForm from '../components/lecturer/ReportForm';

const Reports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

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
      link.download = 'lecture-reports.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting reports:', error);
    }
  };

  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        <Sidebar />
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">
              {user?.role === 'lecturer' ? 'My Reports' :
               user?.role === 'student' ? 'View Reports' : 'All Reports'}
            </h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              {user?.role === 'lecturer' && (
                <button
                  className="btn btn-primary me-2"
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? 'Close Form' : 'New Report'}
                </button>
              )}
              <button className="btn btn-success" onClick={handleExport}>
                <i className="bi bi-download me-1"></i>
                Export Excel
              </button>
            </div>
          </div>

          {/* Inline Report Form for lecturers */}
          {showForm && (
            <div className="mb-4">
              <ReportForm
                onSuccess={() => {
                  setShowForm(false);
                  fetchReports(); // Refresh the reports list
                }}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {/* Search Bar */}
          <SearchBar 
            onSearch={setSearchTerm}
            placeholder="Search by course, lecturer, or class..."
          />

          {/* Loading state */}
          {loading ? (
            <LoadingSpinner message="Loading reports..." />
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Lecturer</th>
                    <th>Class</th>
                    <th>Week</th>
                    <th>Date</th>
                    <th>Students Present</th>
                    <th>Topic</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        No reports found
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr key={report.id}>
                        <td>
                          <strong>{report.course_code}</strong><br/>
                          <small className="text-muted">{report.course_name}</small>
                        </td>
                        <td>{report.lecturer_name}</td>
                        <td>{report.class_name}</td>
                        <td>{report.week_of_reporting}</td>
                        <td>{new Date(report.date_of_lecture).toLocaleDateString()}</td>
                        <td>
                          {report.actual_students_present} / {report.total_registered_students}
                        </td>
                        <td>
                          <div className="text-truncate" style={{maxWidth: '200px'}}>
                            {report.topic_taught}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Reports;
