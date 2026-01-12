import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Public Pages
import HomePage from './pages/PublicPages/HomePage';
import AboutPage from './pages/PublicPages/AboutPage';
import CoursesPage from './pages/PublicPages/CoursesPage';
import GalleryPage from './pages/PublicPages/GalleryPage';
import ContactPage from './pages/PublicPages/ContactPage';



// Auth Pages
import Login from './components/Auth/Login';
import AuthPage from './components/Auth/AuthPage';
// Student Portal
import StudentLayout from './components/StudentPortal/Layout/StudentLayout';
import StudentDashboard from './components/StudentPortal/Dashboard/StudentDashboard';
import Attendance from './components/StudentPortal/Academics/Attendance';
import InternalMarks from './components/StudentPortal/Academics/InternalMarks';
import Timetable from './components/StudentPortal/Academics/Timetable';
import DownloadCenter from './components/StudentPortal/Downloads/DownloadCenter';
import StudentProfile from './components/StudentPortal/Profile/StudentProfile';

// Admin Portal
import AdminPortalPage from './pages/AdminPages/AdminPortalPage';

// Public Layout
import PublicLayout from './components/PublicWebsite/Layout/PublicLayout';

// Import Admission Page
import Admission from './components/PublicWebsite/Admission/Admission';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          <Routes>
            {/* Public Website Routes with Layout */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="admission" element={<Admission />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="portal" element={<AuthPage />} />
            </Route>

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<Login admin={true} />} />

            {/* Student Portal - Protected Route */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentDashboard />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="marks" element={<InternalMarks />} />
              <Route path="timetable" element={<Timetable />} />
              <Route path="downloads" element={<DownloadCenter />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="*" element={<Navigate to="/student" replace />} />
            </Route>

            {/* Admin Portal - Protected Route */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPortalPage />
                </ProtectedRoute>
              } 
            />

            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;