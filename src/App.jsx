import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Courses from './pages/Courses';
import Monitoring from './pages/Monitoring';
import Ratings from './pages/Ratings';
import Classes from './pages/Classes'; // ✅ Classes page

// Components
import StudentDashboard from './components/student/StudentDashboard';
import StudentMonitoring from './components/student/Monitoring';
import ReportForm from './components/lecturer/ReportForm';
import CourseManagement from './components/program-leader/CourseManagement';
import ClassManagement from './components/program-leader/ClassManagement';
import UserManagement from './components/program-leader/UserManagement';

// Common
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/common/Profile';
import Settings from './components/common/Settings';
import NotFound from './components/common/NotFound';
import Footer from './components/common/Footer';

// Utils
import ProtectedRoute from './utils/ProtectedRoute';
import RoleBasedRoute from './utils/RoleBasedRoute';

// Styles
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <div className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <RoleBasedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/student/monitoring"
                element={
                  <RoleBasedRoute allowedRoles={['student']}>
                    <StudentMonitoring />
                  </RoleBasedRoute>
                }
              />

              {/* Reports Routes */}
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports/new"
                element={
                  <RoleBasedRoute allowedRoles={['lecturer']}>
                    <ReportForm />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/reports/edit/:id"
                element={
                  <RoleBasedRoute allowedRoles={['lecturer']}>
                    <ReportForm />
                  </RoleBasedRoute>
                }
              />

              {/* Courses Routes */}
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <Courses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/management"
                element={
                  <RoleBasedRoute allowedRoles={['program_leader']}>
                    <CourseManagement />
                  </RoleBasedRoute>
                }
              />

              {/* Classes Routes */}
              <Route
                path="/classes"
                element={
                  <RoleBasedRoute allowedRoles={['program_leader']}>
                    <Classes /> {/* ✅ General Classes page */}
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/classes/management"
                element={
                  <RoleBasedRoute allowedRoles={['program_leader']}>
                    <Classes /> {/* ✅ Same Classes page */}
                  </RoleBasedRoute>
                }
              />

              {/* Monitoring Routes */}
              <Route
                path="/monitoring"
                element={
                  <ProtectedRoute>
                    <Monitoring />
                  </ProtectedRoute>
                }
              />

              {/* Ratings Routes */}
              <Route
                path="/ratings"
                element={
                  <ProtectedRoute>
                    <Ratings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ratings/class/:classId"
                element={
                  <ProtectedRoute>
                    <Ratings />
                  </ProtectedRoute>
                }
              />

              {/* User Management */}
              <Route
                path="/users/management"
                element={
                  <RoleBasedRoute allowedRoles={['program_leader', 'principal_lecturer']}>
                    <UserManagement />
                  </RoleBasedRoute>
                }
              />

              {/* Profile & Settings */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
