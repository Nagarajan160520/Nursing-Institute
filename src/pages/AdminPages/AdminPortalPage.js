// src/pages/AdminPages/AdminPortalPage.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminPanel/Layout/AdminLayout';

// Import Dashboard
import AdminDashboard from '../../components/AdminPanel/Dashboard/AdminDashboard';

// Import all professional components
import StudentManagement from '../../components/AdminPanel/Management/StudentManagement';
import FacultyManagement from '../../components/AdminPanel/Management/FacultyManagement';
import CourseManagement from '../../components/AdminPanel/Management/CourseManagement';
import AttendanceManagement from '../../components/AdminPanel/Management/AttendanceManagement';
import ContentManagement from '../../components/AdminPanel/Management/CantactManagement';
import ContactManagement from '../../components/AdminPanel/Management/CantactManagement';
import UserManagement from '../../components/AdminPanel/Management/UserManagement';
import SettingsPage from '../../components/AdminPanel/Settings/SettingsPage';
import GalleryManager from '../../components/AdminPanel/Management/GalleryManager';
import DownloadManager from '../../components/AdminPanel/Management/DownloadManager';
import NewsManager from '../../components/AdminPanel/Website/NewsManager';
import EventManager from '../../components/AdminPanel/Website/EventManager';
import NotificationManager from '../../components/AdminPanel/Website/NotificationManager';
import MarksManager from '../../components/AdminPanel/Management/MarksManager';
import TimetableManager from '../../components/AdminPanel/Management/TimetableManager';

const AdminPortalPage = () => {
  return (
    <AdminLayout>
      <Routes>
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* Main Dashboard */}
        <Route path="dashboard" element={<AdminDashboard />} />
        
        {/* Management Pages */}
        <Route path="students" element={<StudentManagement />} />
        <Route path="faculty" element={<FacultyManagement />} />
        <Route path="courses" element={<CourseManagement />} />
        <Route path="attendance" element={<AttendanceManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="contact" element={<ContactManagement />} />
        <Route path="gallery" element={<GalleryManager />} />
        <Route path="downloads" element={<DownloadManager />} />

        {/* Website Management */}
        <Route path="news" element={<NewsManager />} />
        <Route path="events" element={<EventManager />} />
        <Route path="notifications" element={<NotificationManager />} />
        <Route path="marks" element={<MarksManager />} />
        <Route path="timetable" element={<TimetableManager />} />
        
        {/* Settings */}
        <Route path="settings" element={<SettingsPage />} />
        
        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPortalPage;