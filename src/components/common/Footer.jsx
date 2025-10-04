// src/components/common/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3 mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        
        {/* Institute Info */}
        <div className="mb-2 mb-md-0 small">
          © {new Date().getFullYear()} LUCT - Lesotho University of Technology | 
          📍 Maseru, Lesotho | 📧 info@luct.ac.ls | 📞 +266 22 314 551
        </div>

        {/* Quick Links */}
        <div className="mb-2 mb-md-0 small">
          <a href="/dashboard" className="text-white text-decoration-none me-2">Dashboard</a>
          <a href="/reports" className="text-white text-decoration-none me-2">Reports</a>
          <a href="/courses" className="text-white text-decoration-none me-2">Courses</a>
          <a href="/monitoring" className="text-white text-decoration-none me-2">Monitoring</a>
          <a href="/ratings" className="text-white text-decoration-none">Ratings</a>
        </div>

        {/* Social Media */}
        <div className="small">
          <a href="https://www.facebook.com/luct" target="_blank" rel="noopener noreferrer" className="text-white me-2">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="https://www.twitter.com/luct" target="_blank" rel="noopener noreferrer" className="text-white me-2">
            <i className="bi bi-twitter"></i>
          </a>
          <a href="https://www.linkedin.com/school/luct" target="_blank" rel="noopener noreferrer" className="text-white">
            <i className="bi bi-linkedin"></i>
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
