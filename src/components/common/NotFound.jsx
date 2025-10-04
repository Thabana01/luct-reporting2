import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container-fluid vh-100 bg-light">
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-md-6 text-center">
          <div className="error-container">
            <h1 className="display-1 text-muted">404</h1>
            <h2 className="h4 mb-3">Page Not Found</h2>
            <p className="text-muted mb-4">
              The page you're looking for doesn't exist or you don't have permission to access it.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/dashboard" className="btn btn-primary">
                <i className="fas fa-home me-2"></i>
                Go to Dashboard
              </Link>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => window.history.back()}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;