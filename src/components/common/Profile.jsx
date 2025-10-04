import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        <Sidebar />
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">My Profile</h1>
          </div>
          
          <div className="row">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="fas fa-user-circle fa-5x text-muted"></i>
                  </div>
                  <h4>{user?.name}</h4>
                  <p className="text-muted">{user?.email}</p>
                  <span className={`badge ${
                    user?.role === 'student' ? 'bg-success' :
                    user?.role === 'lecturer' ? 'bg-primary' :
                    user?.role === 'program_leader' ? 'bg-warning' : 'bg-info'
                  }`}>
                    {user?.role?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Profile Information</h5>
                </div>
                <div className="card-body">
                  <form>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="name" 
                          defaultValue={user?.name}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          id="email" 
                          defaultValue={user?.email}
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="role" className="form-label">Role</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="role" 
                        defaultValue={user?.role?.replace('_', ' ').toUpperCase()}
                        disabled
                      />
                    </div>
                    
                    <button type="submit" className="btn btn-primary">
                      Update Profile
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;