// components/student/RatingForm.jsx
import React, { useState } from "react";

const RatingForm = ({ report, onRatingSubmit, onCancel }) => {
  const [rating, setRating] = useState(report.rating || 0);
  const [comment, setComment] = useState(report.comment || "");
  const [ratingType, setRatingType] = useState(report.rating_type || "general");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }
    setSubmitting(true);
    try {
      await onRatingSubmit(report.id, rating, comment, ratingType);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="card-title mb-0">
          {report.report_title || "Rate Report / Lecture"}
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Rating Stars */}
          <div className="mb-3">
            <label className="form-label">Rating *</label>
            <select
              className="form-select"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              required
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>

          {/* Rating Type */}
          <div className="mb-3">
            <label className="form-label">Rating Type</label>
            <select
              className="form-select"
              value={ratingType}
              onChange={(e) => setRatingType(e.target.value)}
            >
              <option value="general">General</option>
              <option value="lecture">Lecture</option>
              <option value="content">Content</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          {/* Comment */}
          <div className="mb-3">
            <label className="form-label">Comment (Optional)</label>
            <textarea
              className="form-control"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Rating"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingForm;
