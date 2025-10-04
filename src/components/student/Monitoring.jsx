// Monitoring.jsx
import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';

const Monitoring = () => {
  const [activities, setActivities] = useState([]);
  const [activeRole, setActiveRole] = useState('lecturer');
  const [searchTerm, setSearchTerm] = useState('');

  const roles = ['lecturer', 'student', 'program_leader', 'principal_lecturer'];

  // Mock dataset (your table data)
  const mockActivities = [
    { id: 1, user_id: 5, user_name: "Lecturer 5", role: "lecturer", action: "report_submitted", description: "Submitted lecture report for Web Application Development", module: "report", report_id: 1, created_at: "2025-09-30 22:29:40.691694" },
    { id: 2, user_id: 6, user_name: "Lecturer 6", role: "lecturer", action: "report_submitted", description: "Submitted lecture report for Programming Fundamentals", module: "report", report_id: 2, created_at: "2025-09-30 22:29:40.691694" },
    { id: 3, user_id: 7, user_name: "Lecturer 7", role: "lecturer", action: "report_submitted", description: "Submitted lecture report for Business Information Management", module: "report", report_id: 3, created_at: "2025-09-30 22:29:40.691694" },
    { id: 4, user_id: 8, user_name: "Lecturer 8", role: "lecturer", action: "report_submitted", description: "Submitted lecture report for Database Systems", module: "report", report_id: 4, created_at: "2025-09-30 22:29:40.691694" },
    { id: 5, user_id: 1, user_name: "Program Leader 1", role: "program_leader", action: "report_submitted", description: "Submitted lecture report for Business Marketing", module: "report", report_id: 5, created_at: "2025-09-30 22:29:40.691694" },
    { id: 6, user_id: 2, user_name: "Program Leader 2", role: "program_leader", action: "report_submitted", description: "Submitted lecture report for Network Administration", module: "report", report_id: 6, created_at: "2025-09-30 22:29:40.691694" },
    { id: 7, user_id: 3, user_name: "Principal Lecturer 1", role: "principal_lecturer", action: "report_viewed", description: "Viewed all ICT faculty reports", module: "report", report_id: null, created_at: "2025-09-30 22:29:40.691694" },
    { id: 8, user_id: 4, user_name: "Principal Lecturer 2", role: "principal_lecturer", action: "report_viewed", description: "Viewed all Business faculty reports", module: "report", report_id: null, created_at: "2025-09-30 22:29:40.691694" },
    { id: 9, user_id: 9, user_name: "Student 1", role: "student", action: "rating_added", description: "Rated Web Development lecture 4 stars", module: "report", report_id: 1, created_at: "2025-09-30 22:29:40.691694" },
    { id: 10, user_id: 10, user_name: "Student 2", role: "student", action: "rating_added", description: "Rated Programming lecture 5 stars", module: "report", report_id: 2, created_at: "2025-09-30 22:29:40.691694" },
    { id: 11, user_id: 13, user_name: "Lecturer 13", role: "lecturer", action: "report_submitted", description: "Submitted report for Web", module: "report", report_id: 11, created_at: "2025-10-02 13:18:11.672983" },
    { id: 12, user_id: 13, user_name: "Lecturer 13", role: "lecturer", action: "report_submitted", description: "Submitted report for Data communication", module: "report", report_id: 12, created_at: "2025-10-03 15:44:46.896229" }
  ];

  useEffect(() => {
    // Load mock data for demo
    setActivities(mockActivities);
  }, []);

  const filteredActivities = activities
    .filter(a => a.role === activeRole)
    .filter(a => searchTerm === '' || a.description.toLowerCase().includes(searchTerm.toLowerCase()));

  const getBadge = (action) => {
    switch(action){
      case 'rating_added': return 'bg-warning';
      case 'report_viewed': return 'bg-primary';
      case 'report_submitted': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        <Sidebar />
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Monitoring</h1>
            <input
              type="text"
              className="form-control w-25"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Tabs */}
          <ul className="nav nav-tabs mb-3">
            {roles.map(role => (
              <li className="nav-item" key={role}>
                <button
                  className={`nav-link ${activeRole === role ? 'active' : ''}`}
                  onClick={() => setActiveRole(role)}
                >
                  {role.replace('_', ' ').toUpperCase()}
                </button>
              </li>
            ))}
          </ul>

          {/* Activities Table */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">{activeRole.replace('_', ' ').toUpperCase()} Activities</h5>
            </div>
            <div className="card-body table-responsive">
              {filteredActivities.length === 0 ? (
                <p className="text-center py-3">No activities found for this role.</p>
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Description</th>
                      <th>Module</th>
                      <th>Report ID</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.map(a => (
                      <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{a.user_name}</td>
                        <td>
                          <span className={`badge ${getBadge(a.action)}`}>{a.action.replace('_', ' ')}</span>
                        </td>
                        <td>{a.description}</td>
                        <td>{a.module}</td>
                        <td>{a.report_id || '-'}</td>
                        <td>{new Date(a.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Monitoring;
