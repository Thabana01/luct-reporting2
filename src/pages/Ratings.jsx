// pages/Ratings.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Modal, Button, Form } from 'react-bootstrap';

const Ratings = () => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [ratingsForReport, setRatingsForReport] = useState([]);
  const [selectedRatingId, setSelectedRatingId] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [categoryValue, setCategoryValue] = useState('lecture');
  const [commentValue, setCommentValue] = useState('');

  useEffect(() => {
    fetchRatingsData();
  }, []);

  const fetchRatingsData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ratings');
      setRatings(res.data.ratings || []);
    } catch (err) {
      console.error('Error fetching ratings:', err);
      setError('Failed to load ratings data');
    } finally {
      setLoading(false);
    }
  };

  const openRatingModal = (report) => {
    setSelectedReport(report);

    // Filter ratings for this report
    const reportRatings = ratings.filter(r => r.report_id === report.report_id && r.rating_id);
    setRatingsForReport(reportRatings);

    if (user.role === 'student') {
      const myRating = reportRatings.find(r => r.user_id === user.id);
      if (myRating) {
        setRatingValue(myRating.rating);
        setCategoryValue(myRating.rating_type);
        setCommentValue(myRating.comment);
        setSelectedRatingId(myRating.rating_id);
      } else {
        setRatingValue(5);
        setCategoryValue('lecture');
        setCommentValue('');
        setSelectedRatingId(null);
      }
    } else if (user.role === 'principal_lecturer') {
      setSelectedRatingId(null);
      setRatingValue(5);
      setCategoryValue('lecture');
      setCommentValue('');
    }

    setShowModal(true);
  };

  const handleSubmitRating = async () => {
    try {
      if (user.role === 'principal_lecturer' && !selectedRatingId) {
        return alert('No rating selected to update');
      }

      const payload = {
        report_id: selectedReport.report_id,
        rating: ratingValue,
        rating_type: categoryValue,
        comment: commentValue,
      };

      if (user.role === 'principal_lecturer') {
        payload.rating_id = selectedRatingId;
      }

      await api.post('/ratings', payload);
      setShowModal(false);
      fetchRatingsData();
      alert('Rating submitted successfully!');
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating');
    }
  };

  const renderStarRating = (rating) => (
    <div className="d-flex align-items-center">
      <span className="text-warning me-2">
        {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      </span>
      <span className="badge bg-primary">{rating}/5</span>
    </div>
  );

  if (loading)
    return (
      <div className="spinner-border text-primary m-5" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );

  // STUDENT VIEW
  const renderStudentView = () => (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Class</th>
            <th>Course</th>
            <th>Rating</th>
            <th>Category</th>
            <th>Comment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((r) => (
            <tr key={r.report_id}>
              <td>{r.class_name}</td>
              <td>{r.course_name}</td>
              <td>{r.rating ? renderStarRating(r.rating) : 'Not Rated'}</td>
              <td>{r.rating_type || '-'}</td>
              <td>{r.comment || '-'}</td>
              <td>
                <Button size="sm" onClick={() => openRatingModal(r)}>
                  {r.rating ? 'Edit Rating' : 'Rate'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // LECTURER / PROGRAM LEADER VIEW
  const renderLecturerView = () => (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Class</th>
            <th>Course</th>
            <th>Average Rating</th>
            <th># of Ratings</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((r) => (
            <tr key={r.report_id}>
              <td>{r.class_name}</td>
              <td>{r.course_name}</td>
              <td>{renderStarRating(r.average_rating)}</td>
              <td>{r.num_ratings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        <Sidebar />
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">{user.role === 'student' ? 'My Ratings' : 'Lecture Ratings Summary'}</h1>
            <Button size="sm" variant="outline-secondary" onClick={fetchRatingsData}>
              Refresh
            </Button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {user.role === 'student' ? renderStudentView() : renderLecturerView()}

          {/* Rating Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Rate Lecture: {selectedReport?.course_name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {/* Principal Lecturer selects a student rating */}
                {user.role === 'principal_lecturer' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Select Student Rating</Form.Label>
                    <Form.Select
                      value={selectedRatingId || ''}
                      onChange={(e) => {
                        const rating = ratingsForReport.find(
                          (r) => r.rating_id === parseInt(e.target.value)
                        );
                        setSelectedRatingId(parseInt(e.target.value));
                        setRatingValue(rating.rating);
                        setCategoryValue(rating.rating_type);
                        setCommentValue(rating.comment);
                      }}
                    >
                      <option value="">-- Select a student --</option>
                      {ratingsForReport.map((r) => (
                        <option key={r.rating_id} value={r.rating_id}>
                          {r.user_name || `User ${r.user_id}`} ({r.rating}/5)
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}

                {/* Category */}
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={categoryValue}
                    onChange={(e) => setCategoryValue(e.target.value)}
                  >
                    <option value="lecture">Lecture</option>
                    <option value="content">Content</option>
                    <option value="delivery">Delivery</option>
                    <option value="general">General</option>
                  </Form.Select>
                </Form.Group>

                {/* Rating */}
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

                {/* Comment */}
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
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmitRating}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default Ratings;
