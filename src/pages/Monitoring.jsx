// Page: Monitoring.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api"; // your axios instance

const Monitoring = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState("lecturer"); // default tab

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/monitoring");
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const roles = ["lecturer", "student", "program_leader", "principal_lecturer"];

  if (loading) return <p className="text-center mt-5">Loading monitoring data...</p>;

  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        <Sidebar />
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Monitoring</h1>
          </div>

          <div className="mb-4">
            <ul className="nav nav-tabs">
              {roles.map((role) => (
                <li className="nav-item" key={role}>
                  <button
                    className={`nav-link ${activeRole === role ? "active" : ""}`}
                    onClick={() => setActiveRole(role)}
                  >
                    {role.replace("_", " ").toUpperCase()}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">System Activities - {activeRole.replace("_", " ").toUpperCase()}</h5>
            </div>
            <div className="card-body table-responsive">
              {logs.filter(log => log.role === activeRole).length === 0 ? (
                <p>No activities for this role yet.</p>
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
                    {logs
                      .filter((log) => log.role === activeRole)
                      .map((log) => (
                        <tr key={log.id}>
                          <td>{log.id}</td>
                          <td>{log.user_name}</td>
                          <td>{log.action}</td>
                          <td>{log.description}</td>
                          <td>{log.module}</td>
                          <td>{log.report_id || "-"}</td>
                          <td>{new Date(log.created_at).toLocaleString()}</td>
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
