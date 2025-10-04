import React from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const getRoleDisplayName = (role) => {
    const roleNames = {
      student: 'Student',
      lecturer: 'Lecturer',
      principal_lecturer: 'Principal Lecturer',
      program_leader: 'Program Leader'
    };
    return roleNames[role] || role;
  };

  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        <Sidebar />
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <div className="card text-white bg-primary mb-3">
                <div className="card-body">
                  <h5 className="card-title">Welcome</h5>
                  <p className="card-text">Hello {user?.name}, welcome to LUCT Reporting System</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card text-white bg-success mb-3">
                <div className="card-body">
                  <h5 className="card-title">Role</h5>
                  <p className="card-text">{getRoleDisplayName(user?.role)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">System Overview</h5>
                </div>
                <div className="card-body">
                  <p>Welcome to the Limkokwing University of Creative Technology Reporting System.</p>
                  <p>Use the sidebar to navigate through the different modules based on your role.</p>
                  
                  <div className="row mt-4">
                    <div className="col-md-4">
                      <div className="card bg-light">
                        <div className="card-body text-center">
                          <i className="bi bi-file-text fs-1 text-primary"></i>
                          <h6 className="mt-2">Reports</h6>
                          <p className="text-muted small">Manage lecture reports and feedback</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="card bg-light">
                        <div className="card-body text-center">
                          <i className="bi bi-graph-up fs-1 text-success"></i>
                          <h6 className="mt-2">Monitoring</h6>
                          <p className="text-muted small">Track system activities</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="card bg-light">
                        <div className="card-body text-center">
                          <i className="bi bi-star fs-1 text-warning"></i>
                          <h6 className="mt-2">Ratings</h6>
                          <p className="text-muted small">Rate lectures and provide feedback</p>
                        </div>
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

export default Dashboard;