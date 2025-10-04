// src/pages/PLDashboard.jsx
import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { reportService } from '../../services/reportService';
import { courseService } from '../../services/courseService';
import { lecturerService } from '../../services/lecturerService';
import { studentService } from '../../services/studentService';

const PLDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    totalCourses: 0,
    activeLecturers: 0,
    studentEnrollment: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.role === 'program_leader') {
      fetchPLData();
    }
  }, [user, authLoading]);

  const fetchPLData = async () => {
    setLoading(true);
    try {
      // Fetch reports, courses, lecturers, students
      const [reportsData, coursesData, lecturersData, studentsData] = await Promise.all([
        reportService.getReports(),
        courseService.getCourses(),
        lecturerService.getLecturers(),
        studentService.getStudents()
      ]);

      // Filter courses for this Program Leader
      const programCourses = coursesData.courses?.filter(c => c.program_leader_id === user.id) || [];

      setReports(reportsData.reports?.slice(0, 5) || []);
      setCourses(programCourses.slice(0, 5));

      setStats({
        totalReports: reportsData.reports?.length || 0,
        totalCourses: programCourses.length,
        activeLecturers: lecturersData.length || 0,
        studentEnrollment: studentsData.length || 0
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
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

  if (!user || user.role !== 'program_leader') {
    return (
      <div className="container-fluid">
        <Header />
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
            <h3>Access Denied</h3>
            <p>Only Program Leaders can access this dashboard.</p>
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
          {/* Dashboard Header */}
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Program Leader Dashboard</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <button
                className="btn btn-success me-2"
                onClick={() => window.location.href = '/courses'}
              >
                <i className="bi bi-plus-circle me-1"></i> New Course
              </button>
              <button className="btn btn-primary">
                <i className="bi bi-download me-1"></i> Export Data
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-white bg-primary">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="card-title">Total Reports</h5>
                      <h2 className="mb-0">{stats.totalReports}</h2>
                    </div>
                    <i className="bi bi-files fs-1 opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-success">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="card-title">Courses</h5>
                      <h2 className="mb-0">{stats.totalCourses}</h2>
                    </div>
                    <i className="bi bi-journal-text fs-1 opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-info">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="card-title">Active Lecturers</h5>
                      <h2 className="mb-0">{stats.activeLecturers}</h2>
                    </div>
                    <i className="bi bi-people fs-1 opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-warning">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="card-title">Students</h5>
                      <h2 className="mb-0">{stats.studentEnrollment}</h2>
                    </div>
                    <i className="bi bi-person-check fs-1 opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reports and Program Courses */}
          <div className="row">
            {/* Recent Reports */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Recent Reports</h5>
                  <a href="/reports" className="btn btn-sm btn-outline-primary">View All</a>
                </div>
                <div className="card-body">
                  {reports.length === 0 ? (
                    <p className="text-muted">No reports available.</p>
                  ) : (
                    <div className="list-group list-group-flush">
                      {reports.map(report => (
                        <div key={report.id} className="list-group-item px-0">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">{report.course_code}</h6>
                            <small className="text-muted">{report.week_of_reporting}</small>
                          </div>
                          <p className="mb-1">{report.course_name}</p>
                          <small className="text-muted">
                            {report.lecturer_name} • {report.class_name} • Attendance: {report.actual_students_present}/{report.total_registered_students}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Program Courses */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Program Courses</h5>
                  <a href="/courses" className="btn btn-sm btn-outline-success">Manage</a>
                </div>
                <div className="card-body">
                  {courses.length === 0 ? (
                    <p className="text-muted">No courses available.</p>
                  ) : (
                    <div className="list-group list-group-flush">
                      {courses.map(course => (
                        <div key={course.id} className="list-group-item px-0">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">{course.course_code}</h6>
                            <span className="badge bg-primary">{course.credits} Credits</span>
                          </div>
                          <p className="mb-1">{course.course_name}</p>
                          <small className="text-muted">Stream: {course.stream} • Students: 45</small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Analytics (static placeholders) */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Program Analytics</h5>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-3">
                      <div className="border rounded p-3">
                        <i className="bi bi-check-circle fs-1 text-success mb-2"></i>
                        <h5>85%</h5>
                        <small className="text-muted">Report Completion Rate</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="border rounded p-3">
                        <i className="bi bi-graph-up fs-1 text-primary mb-2"></i>
                        <h5>92%</h5>
                        <small className="text-muted">Student Attendance</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="border rounded p-3">
                        <i className="bi bi-star fs-1 text-warning mb-2"></i>
                        <h5>4.2</h5>
                        <small className="text-muted">Average Rating</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="border rounded p-3">
                        <i className="bi bi-lightning fs-1 text-info mb-2"></i>
                        <h5>78%</h5>
                        <small className="text-muted">On-time Submission</small>
                      </div>
                    </div>
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

export default PLDashboard;
