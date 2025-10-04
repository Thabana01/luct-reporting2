import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Settings = () => {
  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        <Sidebar />
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Settings</h1>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Application Settings</h5>
                </div>
                <div className="card-body">
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Settings functionality will be implemented in future updates.
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Notification Settings</h6>
                      <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                        <label className="form-check-label" htmlFor="emailNotifications">
                          Email Notifications
                        </label>
                      </div>
                      
                      <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="pushNotifications" defaultChecked />
                        <label className="form-check-label" htmlFor="pushNotifications">
                          Push Notifications
                        </label>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <h6>Display Settings</h6>
                      <div className="mb-3">
                        <label htmlFor="theme" className="form-label">Theme</label>
                        <select className="form-select" id="theme">
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <button className="btn btn-primary">Save Settings</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;