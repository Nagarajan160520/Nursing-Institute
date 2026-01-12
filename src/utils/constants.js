// Application Constants and Configuration

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
};

export const ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
  FACULTY: 'faculty',
  ALL: ['admin', 'student', 'faculty']
};

export const COURSE_TYPES = {
  GNM: 'GNM (General Nursing & Midwifery)',
  ANM: 'ANM (Auxiliary Nurse Midwifery)',
  BSC_NURSING: 'B.Sc Nursing',
  MSC_NURSING: 'M.Sc Nursing',
  POST_BASIC: 'Post Basic B.Sc Nursing',
  DIPLOMA: 'Diploma in Nursing'
};

export const COURSE_DURATIONS = {
  GNM: '3 Years 6 Months',
  ANM: '2 Years',
  BSC_NURSING: '4 Years',
  MSC_NURSING: '2 Years',
  POST_BASIC: '2 Years',
  DIPLOMA: '2 Years'
};

export const GALLERY_CATEGORIES = [
  { value: 'Events', label: 'Events', color: 'primary' },
  { value: 'Campus', label: 'Campus', color: 'success' },
  { value: 'Practical', label: 'Practical Sessions', color: 'info' },
  { value: 'Cultural', label: 'Cultural', color: 'warning' },
  { value: 'Sports', label: 'Sports', color: 'danger' },
  { value: 'Workshop', label: 'Workshops', color: 'secondary' },
  { value: 'Seminar', label: 'Seminars', color: 'dark' }
];

export const NEWS_CATEGORIES = [
  { value: 'General', label: 'General News', color: 'primary' },
  { value: 'Exam', label: 'Exam Notification', color: 'danger' },
  { value: 'Event', label: 'Event', color: 'success' },
  { value: 'Result', label: 'Result', color: 'info' },
  { value: 'Holiday', label: 'Holiday', color: 'warning' },
  { value: 'Placement', label: 'Placement', color: 'secondary' },
  { value: 'Admission', label: 'Admission', color: 'dark' },
  { value: 'Circular', label: 'Circular', color: 'light' }
];

export const DOWNLOAD_CATEGORIES = [
  { value: 'Syllabus', label: 'Syllabus', icon: '📚' },
  { value: 'Timetable', label: 'Timetable', icon: '📅' },
  { value: 'Notes', label: 'Study Notes', icon: '📝' },
  { value: 'Question Paper', label: 'Question Papers', icon: '📄' },
  { value: 'Lab Manual', label: 'Lab Manuals', icon: '🔬' },
  { value: 'Form', label: 'Forms', icon: '📋' },
  { value: 'Circular', label: 'Circulars', icon: '📢' },
  { value: 'Result', label: 'Results', icon: '📊' },
  { value: 'Hall Ticket', label: 'Hall Tickets', icon: '🎫' },
  { value: 'Certificate', label: 'Certificates', icon: '🏆' },
  { value: 'Other', label: 'Other Documents', icon: '📎' }
];

export const FILE_TYPES = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS: 'application/vnd.ms-excel',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPT: 'application/vnd.ms-powerpoint',
  PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  IMAGE: 'image/*',
  ZIP: 'application/zip'
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ATTENDANCE_STATUS = {
  PRESENT: { value: 'Present', color: 'success', badge: 'Present' },
  ABSENT: { value: 'Absent', color: 'danger', badge: 'Absent' },
  LATE: { value: 'Late', color: 'warning', badge: 'Late' },
  LEAVE: { value: 'Leave', color: 'info', badge: 'On Leave' },
  MEDICAL_LEAVE: { value: 'Medical Leave', color: 'primary', badge: 'Medical Leave' },
  HOLIDAY: { value: 'Holiday', color: 'secondary', badge: 'Holiday' }
};

export const EXAM_TYPES = [
  { value: 'Internal', label: 'Internal Exam', color: 'primary' },
  { value: 'External', label: 'External Exam', color: 'danger' },
  { value: 'Practical', label: 'Practical Exam', color: 'success' },
  { value: 'Assignment', label: 'Assignment', color: 'info' },
  { value: 'Project', label: 'Project', color: 'warning' },
  { value: 'Terminal', label: 'Terminal Exam', color: 'dark' }
];

export const GRADE_SYSTEM = [
  { min: 90, max: 100, grade: 'O', points: 10, remark: 'Outstanding' },
  { min: 80, max: 89, grade: 'A+', points: 9, remark: 'Excellent' },
  { min: 70, max: 79, grade: 'A', points: 8, remark: 'Very Good' },
  { min: 60, max: 69, grade: 'B+', points: 7, remark: 'Good' },
  { min: 50, max: 59, grade: 'B', points: 6, remark: 'Above Average' },
  { min: 40, max: 49, grade: 'C', points: 5, remark: 'Average' },
  { min: 35, max: 39, grade: 'D', points: 4, remark: 'Pass' },
  { min: 0, max: 34, grade: 'F', points: 0, remark: 'Fail' }
];

export const STUDENT_STATUS = {
  ACTIVE: { value: 'Active', color: 'success', label: 'Active' },
  COMPLETED: { value: 'Completed', color: 'info', label: 'Completed' },
  DISCONTINUED: { value: 'Discontinued', color: 'danger', label: 'Discontinued' },
  ON_LEAVE: { value: 'On Leave', color: 'warning', label: 'On Leave' },
  SUSPENDED: { value: 'Suspended', color: 'secondary', label: 'Suspended' }
};

export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export const GENDERS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' }
];

export const STATES = [
  'Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana',
  'Maharashtra', 'Delhi', 'West Bengal', 'Uttar Pradesh', 'Rajasthan',
  'Gujarat', 'Madhya Pradesh', 'Punjab', 'Haryana', 'Bihar'
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const SEMESTERS = [
  { value: 1, label: 'Semester I' },
  { value: 2, label: 'Semester II' },
  { value: 3, label: 'Semester III' },
  { value: 4, label: 'Semester IV' },
  { value: 5, label: 'Semester V' },
  { value: 6, label: 'Semester VI' },
  { value: 7, label: 'Semester VII' },
  { value: 8, label: 'Semester VIII' }
];

export const ACADEMIC_YEARS = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    years.push(`${i}-${i + 1}`);
  }
  return years;
};

export const NOTIFICATION_TYPES = {
  INFO: { value: 'info', color: 'primary', icon: 'ℹ️' },
  SUCCESS: { value: 'success', color: 'success', icon: '✅' },
  WARNING: { value: 'warning', color: 'warning', icon: '⚠️' },
  DANGER: { value: 'danger', color: 'danger', icon: '❌' },
  PRIMARY: { value: 'primary', color: 'primary', icon: '📢' }
};

export const NOTIFICATION_CATEGORIES = [
  'Academic', 'Administrative', 'Event', 'Exam', 'Result', 
  'Placement', 'Fee', 'Holiday', 'Emergency', 'General'
];

export const PLACEMENT_STATUS = {
  OFFERED: { value: 'Offered', color: 'warning', label: 'Offered' },
  ACCEPTED: { value: 'Accepted', color: 'info', label: 'Accepted' },
  JOINED: { value: 'Joined', color: 'success', label: 'Joined' },
  REJECTED: { value: 'Rejected', color: 'danger', label: 'Rejected' },
  INTERNSHIP: { value: 'Internship', color: 'primary', label: 'Internship' },
  COMPLETED: { value: 'Completed', color: 'secondary', label: 'Completed' },
  TERMINATED: { value: 'Terminated', color: 'dark', label: 'Terminated' }
};

export const JOB_TYPES = [
  'Full-time', 'Part-time', 'Internship', 'Contract', 'Trainee'
];

// Dashboard Chart Colors
export const CHART_COLORS = {
  primary: 'rgba(44, 62, 80, 0.8)',
  secondary: 'rgba(52, 152, 219, 0.8)',
  success: 'rgba(39, 174, 96, 0.8)',
  warning: 'rgba(243, 156, 18, 0.8)',
  danger: 'rgba(231, 76, 60, 0.8)',
  info: 'rgba(41, 128, 185, 0.8)',
  light: 'rgba(236, 240, 241, 0.8)',
  dark: 'rgba(52, 73, 94, 0.8)'
};

// Theme Colors
export const THEME_COLORS = {
  primary: '#2c3e50',
  secondary: '#3498db',
  success: '#27ae60',
  danger: '#e74c3c',
  warning: '#f39c12',
  info: '#3498db',
  light: '#ecf0f1',
  dark: '#2c3e50',
  white: '#ffffff'
};

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  PINCODE: /^[0-9]{6}$/,
  STUDENT_ID: /^[A-Z]{3}[0-9]{6}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  TIME: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid 10-digit phone number',
  INVALID_PASSWORD: 'Password must be at least 8 characters with letters, numbers, and special characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  FILE_TOO_LARGE: (size) => `File size must be less than ${size}MB`,
  INVALID_FILE_TYPE: 'Invalid file type',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'Resource not found.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  LOGOUT: 'Logged out successfully',
  REGISTER: 'Registration successful!',
  UPDATE: 'Update successful!',
  DELETE: 'Delete successful!',
  UPLOAD: 'Upload successful!',
  CREATE: 'Created successfully!',
  SAVE: 'Saved successfully!',
  SEND: 'Sent successfully!'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'nursing_institute_token',
  USER: 'nursing_institute_user',
  THEME: 'nursing_institute_theme',
  LANGUAGE: 'nursing_institute_language',
  LAST_VISIT: 'nursing_institute_last_visit'
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZES: [5, 10, 20, 50, 100]
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD MMM YYYY',
  DISPLAY_WITH_TIME: 'DD MMM YYYY hh:mm A',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
  TIME_ONLY: 'hh:mm A',
  MONTH_YEAR: 'MMMM YYYY'
};

// Application Settings
export const APP_SETTINGS = {
  NAME: 'Nursing Institute Management System',
  VERSION: '1.0.0',
  DESCRIPTION: 'Comprehensive management system for nursing institutes',
  DEVELOPER: 'Nursing Institute IT Team',
  SUPPORT_EMAIL: 'support@nursinginstitute.edu',
  SUPPORT_PHONE: '+91 9876543210',
  ADDRESS: '123 Medical Street, Healthcare City, Tamil Nadu - 641001',
  COPYRIGHT: `© ${new Date().getFullYear()} Nursing Institute. All rights reserved.`
};

// Export all constants as default
export default {
  API_CONFIG,
  ROLES,
  COURSE_TYPES,
  COURSE_DURATIONS,
  GALLERY_CATEGORIES,
  NEWS_CATEGORIES,
  DOWNLOAD_CATEGORIES,
  FILE_TYPES,
  MAX_FILE_SIZE,
  ATTENDANCE_STATUS,
  EXAM_TYPES,
  GRADE_SYSTEM,
  STUDENT_STATUS,
  BLOOD_GROUPS,
  GENDERS,
  STATES,
  MONTHS,
  SEMESTERS,
  ACADEMIC_YEARS,
  NOTIFICATION_TYPES,
  NOTIFICATION_CATEGORIES,
  PLACEMENT_STATUS,
  JOB_TYPES,
  CHART_COLORS,
  THEME_COLORS,
  VALIDATION_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  PAGINATION,
  DATE_FORMATS,
  APP_SETTINGS
};