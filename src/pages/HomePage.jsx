// pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // import your CSS

const modules = [
  {
    title: 'Student',
    description: 'Login/Register, Monitoring, and Rating modules for students to track lectures and provide feedback.',
    icon: 'bi-person'
  },
  {
    title: 'Lecturer',
    description: 'Manage Classes, submit Reports, track Monitoring, and view Ratings for your lectures.',
    icon: 'bi-pen'
  },
  {
    title: 'Principal Lecturer (PRL)',
    description: 'View Courses & Lectures, check Reports and add feedback, Monitor classes, and see Ratings.',
    icon: 'bi-journal-check'
  },
  {
    title: 'Program Leader (PL)',
    description: 'Add/Assign Courses & Lectures, view PRL reports, manage Classes and Lecturers, and track Ratings.',
    icon: 'bi-people'
  }
];

const HomePage = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4">LUCT Web Reporting System</h1>
        <p className="lead">
          Welcome to the Faculty of ICT reporting system. Please login to access your modules.
        </p>
      </div>

      <div className="row">
        {modules.map((module, index) => (
          <div key={index} className="col-md-6 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center d-flex flex-column justify-content-between">
                <div>
                  <i className={`bi ${module.icon} fs-1 mb-3`}></i>
                  <h5 className="card-title">{module.title}</h5>
                  <p className="card-text">{module.description}</p>
                </div>
                <Link to="/login" className="btn btn-primary mt-3">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 text-center">
        <h5>Technology Stack</h5>
        <p>Frontend: React, CSS, Bootstrap | Backend: Node.js | Database: SQL / XAMPP</p>
      </div>

      <div className="mt-3 text-center">
        <small>Web Application Development - DIWA2110 | Faculty of ICT | Limkokwing University of Creative Technology</small>
      </div>
    </div>
  );
};

export default HomePage;
