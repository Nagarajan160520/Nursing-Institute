import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentLayout from '../components/StudentPortal/Layout/StudentLayout';
import StudentDashboard from '../components/StudentPortal/Dashboard/StudentDashboard';
import StudentProfile from '../components/StudentPortal/Profile/StudentProfile';
import Attendance from '../components/StudentPortal/Academics/Attendance';
import InternalMarks from '../components/StudentPortal/Academics/InternalMarks';
import ClinicalSchedule from '../components/StudentPortal/Clinicals/ClinicalSchedule';
import DownloadCenter from '../components/StudentPortal/Downloads/DownloadCenter';
import StudentNotifications from '../components/StudentPortal/Notifications/StudentNotifications';

const StudentPortal = () => {
    return (
        <StudentLayout>
            <Routes>
                <Route index element={<StudentDashboard />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="marks" element={<InternalMarks />} />
                <Route path="clinical-schedule" element={<ClinicalSchedule />} />
                <Route path="downloads" element={<DownloadCenter />} />
                <Route path="notifications" element={<StudentNotifications />} />
                <Route path="*" element={<StudentDashboard />} />
            </Routes>
        </StudentLayout>
    );
};

export default StudentPortal;