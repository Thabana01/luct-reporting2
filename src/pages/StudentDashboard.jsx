import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import SearchBar from '../common/SearchBar';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { reportService } from '../../services/reportService';
import { ratingService } from '../../services/ratingService';
import { monitoringService } from '../../services/monitoringService';
import { Modal, Button, Form } from 'react-bootstrap';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [recentReports, setRecentReports] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [categoryValue, setCategoryValue] = useState('lecture');
  const [commentValue, setCommentValue] = useState('');

  useEffect(() => {
    fetchStudentData();
  }, [searchTerm, filterType]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const [reportsData, ratingsData, monitoringData] = await Promise.all([
        reportService.getReports(),
        ratingService.getMyRatings(),
        monitoringService.getMyActivities()
      ]);

      setRecentReports(reportsData.reports?.slice(0, 5) || []);
      setMyRatings(ratingsData.ratings || []);

      // Monitoring filter
      let filteredActivities = monitoringData.activities || [];
      if (searchTerm) {
        filteredActivities = filteredActivities.filter(activity =>
          activity.activity_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.activity_type?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (filterType !== 'all') {
        filteredActivities = filteredActivities.filter(
          activity => activity.activity_type === filterType
        );
      }
      setActivities(filteredActivities);

    } catch (error) {
      console.error('Error fetching student data:', error);
      setRecentReports([]);
      setMyRatings([]);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const openRatingModal = (report) => {
    setSelectedReport(report);
    setRatingValue(5);
    setCategoryValue(report.course_code === "DIWA2110" ? "lecture" : "general");
    setCommentValue('');
    setShowModal(true);
  };

  const handleSubmitRating = async () => {
    try {
      await ratingService.postRating({
        report_id: selectedReport.id,
        rating: ratingValue,
        comment: commentValue,
        category: categoryValue
      });
      setShowModal(false);
      fetchStudentData();
      alert('Rating submitted successfully!');
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert('Failed to submit rating.');
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'rating_added': return 'bi-star-fill text-warning';
      case 'report_viewed': return 'bi-eye text-primary';
      case 'login': return 'bi-box-arrow-in-right text-success';
      case 'profile_updated': return 'bi-person text-info';
      default: return 'bi-activity text-secondary';
    }
  };

  const getActivityBadge = (type) => {
    switch (type) {
      case 'rating_added': return 'bg-warning';
      case 'report_viewed': return 'bg-primary';
      case 'login': return 'bg-success';
      case 'profile_updated': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const formatActivityDescription = (activity) => {
    switch (activity.activity_type) {
      case 'rating_added': return `You rated a lecture report`;
      case 'report_viewed': return `You viewed a lecture report`;
      case 'login': return `You logged into the system`;
      case 'profile_updated': return `You updated your profile`;
      default: return activity.activity_description;
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <Header />
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <LoadingSpinner message="Loading student dashboard..." />
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

          {/* Welcome & Stats */}
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Student Dashboard</h1>
            <span className="badge bg-secondary">Welcome, {user?.name}</span>
          </div>

          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card text-white bg-primary">
                <div className="card-body">
                  <h5>Available Reports</h5>
                  <h2>{recentReports.length}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-success">
                <div className="card-body">
                  <h5>My Ratings</h5>
                  <h2>{myRatings.length}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-warning">
                <div className="card-body">
                  <h5>Total Activities</h5>
                  <h2>{activities.length}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Table */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between">
              <h5>Recent Lecture Reports</h5>
              <span className="badge bg-primary">{recentReports.length} reports</span>
            </div>
            <div className="card-body">
              {recentReports.length === 0 ? (
                <p className="text-muted">No reports yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
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
                        const hasRated = myRatings.some(r => r.report_id === report.id);
                        return (
                          <tr key={report.id}>
                            <td><strong>{report.course_code}</strong><br/><small>{report.course_name}</small></td>
                            <td>{report.lecturer_name}</td>
                            <td>{report.topic_taught}</td>
                            <td>{new Date(report.date_of_lecture).toLocaleDateString()}</td>
                            <td>
                              <span className={`badge ${
                                report.actual_students_present / report.total_registered_students > 0.8 
                                ? 'bg-success' : 'bg-warning'
                              }`}>
                                {report.actual_students_present}/{report.total_registered_students}
                              </span>
                            </td>
                            <td>
                              {hasRated ? (
                                <span className="badge bg-success">Rated</span>
                              ) : (
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => openRatingModal(report)}
                                >
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

          {/* Activities */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>My Activities</h5>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-8">
                  <SearchBar onSearch={setSearchTerm} placeholder="Search your activities..." />
                </div>
                <div className="col-md-4">
                  <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">All Activities</option>
                    <option value="rating_added">Ratings</option>
                    <option value="report_viewed">Report Views</option>
                    <option value="login">Logins</option>
                    <option value="profile_updated">Profile Updates</option>
                  </select>
                </div>
              </div>

              {activities.length === 0 ? (
                <p className="text-muted">No activities found.</p>
              ) : (
                <ul className="list-group">
                  {activities.map((activity) => (
                    <li key={activity.id} className="list-group-item d-flex justify-content-between">
                      <div>
                        <i className={`bi ${getActivityIcon(activity.activity_type)} me-2`}></i>
                        {formatActivityDescription(activity)}
                      </div>
                      <small className={`badge ${getActivityBadge(activity.activity_type)}`}>
                        {new Date(activity.created_at).toLocaleDateString()}
                      </small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Rating Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Rate Lecture: {selectedReport?.course_name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select value={categoryValue} onChange={(e) => setCategoryValue(e.target.value)}>
                    <option value="lecture">Lecture</option>
                    <option value="content">Content</option>
                    <option value="delivery">Delivery</option>
                    <option value="general">General</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Rating (1–5)</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={5}
                    value={ratingValue}
                    onChange={(e) => setRatingValue(parseInt(e.target.value))}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={commentValue}
                    onChange={(e) => setCommentValue(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmitRating}>Submit Rating</Button>
            </Modal.Footer>
          </Modal>

        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
