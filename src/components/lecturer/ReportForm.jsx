// Lecturer components
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reportService } from '../../services/reportService';

const ReportForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    faculty_name: 'Faculty of ICT',
    class_name: '',
    week_of_reporting: '',
    date_of_lecture: '',
    course_name: '',
    course_code: '',
    lecturer_name: user?.name || '',
    actual_students_present: '',
    total_registered_students: '',
    venue: '',
    scheduled_lecture_time: '',
    topic_taught: '',
    learning_outcomes: '',
    lecturer_recommendations: '',
    class_id: ''
  });

  useEffect(() => {
    // In a real app, you would fetch classes from API
    setClasses([
      { id: 1, class_name: 'IT-DIP-A-2024', faculty_name: 'Faculty of ICT', total_students: 45 },
      { id: 2, class_name: 'IT-DIP-B-2024', faculty_name: 'Faculty of ICT', total_students: 38 },
      { id: 3, class_name: 'BIT-DEG-2024', faculty_name: 'Faculty of Business', total_students: 42 }
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill total registered students when class is selected
    if (name === 'class_id') {
      const selectedClass = classes.find(cls => cls.id === parseInt(value));
      if (selectedClass) {
        setFormData(prev => ({
          ...prev,
          class_name: selectedClass.class_name,
          faculty_name: selectedClass.faculty_name,
          total_registered_students: selectedClass.total_students
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await reportService.createReport(formData);
      if (onSuccess) onSuccess();
      alert('Report submitted successfully!');
    } catch (error) {
      alert('Error submitting report: ' + error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Submit Lecture Report</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Class *</label>
                <select
                  className="form-select"
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class_name} - {cls.faculty_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Week of Reporting *</label>
                <input
                  type="text"
                  className="form-control"
                  name="week_of_reporting"
                  value={formData.week_of_reporting}
                  onChange={handleChange}
                  placeholder="e.g., Week 6"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Date of Lecture *</label>
                <input
                  type="date"
                  className="form-control"
                  name="date_of_lecture"
                  value={formData.date_of_lecture}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Course Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleChange}
                  placeholder="e.g., Web Application Development"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Course Code *</label>
                <input
                  type="text"
                  className="form-control"
                  name="course_code"
                  value={formData.course_code}
                  onChange={handleChange}
                  placeholder="e.g., DIWA2110"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Actual Students Present *</label>
                <input
                  type="number"
                  className="form-control"
                  name="actual_students_present"
                  value={formData.actual_students_present}
                  onChange={handleChange}
                  min="1"
                  max={formData.total_registered_students}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Total Registered Students</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.total_registered_students}
                  readOnly
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Venue *</label>
                <input
                  type="text"
                  className="form-control"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g., Room 101"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Scheduled Lecture Time *</label>
                <input
                  type="time"
                  className="form-control"
                  name="scheduled_lecture_time"
                  value={formData.scheduled_lecture_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Topic Taught *</label>
                <textarea
                  className="form-control"
                  name="topic_taught"
                  value={formData.topic_taught}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the main topic covered in this lecture..."
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Learning Outcomes *</label>
                <textarea
                  className="form-control"
                  name="learning_outcomes"
                  value={formData.learning_outcomes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="What should students be able to do after this lecture?"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Lecturer's Recommendations</label>
                <textarea
                  className="form-control"
                  name="lecturer_recommendations"
                  value={formData.lecturer_recommendations}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any recommendations for improvement or follow-up actions..."
                />
              </div>
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;