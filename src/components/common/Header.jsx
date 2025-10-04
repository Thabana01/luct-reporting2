import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <span className="navbar-brand">LUCT Reporting System</span>
        
        <div className="d-flex align-items-center">
          <span className="text-light me-3">
            Welcome, {user?.name} ({user?.role})
          </span>
          <button 
            className="btn btn-outline-light btn-sm"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;