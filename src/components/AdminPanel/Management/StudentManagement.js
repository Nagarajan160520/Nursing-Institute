import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Table, Modal,
  Alert, Badge, InputGroup, FormControl, Spinner, ProgressBar
} from 'react-bootstrap';
import {
  FaUserPlus, FaEdit, FaTrash, FaEye, FaSearch,
  FaFilter, FaDownload, FaUpload, FaFileExcel,
  FaCopy, FaEnvelope, FaPrint, FaIdCard, FaCheck,
  FaSync, FaKey, FaFileCsv, FaUsers, FaUserCheck,
  FaMars, FaVenus, FaChartBar, FaTimes, FaCalendarAlt,
  FaPhone, FaEnvelopeOpen, FaMapMarkerAlt, FaUserGraduate,
  FaBook, FaUniversity, FaUserTag, FaIdBadge
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';


const StudentManagement = () => {
  // State variables
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    course: '',
    semester: '', 
    status: '',
    batch: ''
  });
 
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  // Edit student modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // ✅ NEW: View Student Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewStudentData, setViewStudentData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Selected student for actions
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: '',
    sendEmail: true
  });

  // New student form state - SIMPLIFIED VERSION
  const [newStudent, setNewStudent] = useState({
    // ✅ ONLY ESSENTIAL FIELDS - Backend expects these
    firstName: '',
    lastName: '',
    personalEmail: '',
    mobileNumber: '',
    courseEnrolled: '',
    
    // Optional fields
    gender: 'Male',
    dateOfBirth: '',
    fatherName: '',
    fatherMobile: '',
    admissionYear: new Date().getFullYear(),
    semester: 1
  });

  // Form validation
  const [formErrors, setFormErrors] = useState({});
  const [emailChecking, setEmailChecking] = useState(false);

  // Generated credentials
  const [generatedCredentials, setGeneratedCredentials] = useState({
    studentId: '',
    instituteEmail: '',
    password: '',
    loginUrl: ''
  });

  // Statistics - FIXED: Initialize with proper structure
  const [stats, setStats] = useState({
    overall: {
      total: 0,
      active: 0,
      male: 0,
      female: 0
    },
    courses: [],
    semesters: []
  });

  // Course distribution for chart
  const [courseDistribution, setCourseDistribution] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchStats();
  }, []);

  // Fetch students with filters
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };

      console.log('📡 Fetching students with params:', params);

      const response = await api.get('/admin/students', { params });
      
      console.log('✅ Students response:', response.data);
      
      if (response.data.success) {
        setStudents(response.data.data?.students || []);
        setPagination({
          page: response.data.data?.pagination?.page || 1,
          limit: response.data.data?.pagination?.limit || 10,
          total: response.data.data?.pagination?.total || 0,
          pages: response.data.data?.pagination?.pages || 0
        });
      } else {
        toast.error(response.data.message || 'Failed to fetch students');
      }
    } catch (error) {
      console.error('❌ Fetch students error:', error);
      if (error.response?.status === 404) {
        toast.error('Students endpoint not found. Check backend routes.');
      } else if (error.response?.status === 401) {
        toast.error('Please login again');
      } else {
        toast.error('Failed to fetch students. Check backend connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Fetch single student details for view
  const fetchStudentDetails = async (studentId) => {
    setViewLoading(true);
    try {
      console.log('📡 Fetching student details for ID:', studentId);
      
      const response = await api.get(`/admin/students/${studentId}`);
      
      if (response.data.success) {
        console.log('✅ Student details:', response.data.data);
        setViewStudentData(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to fetch student details');
        // Fallback to existing student data from table
        const studentFromList = students.find(s => s._id === studentId);
        if (studentFromList) {
          setViewStudentData(studentFromList);
        }
      }
    } catch (error) {
      {/*console.error('❌ Fetch student details error:', error);
      toast.error('Failed to load student details'); */}
      // Fallback to existing student data from table
      const studentFromList = students.find(s => s._id === studentId);
      if (studentFromList) {
        setViewStudentData(studentFromList);
      }
    } finally {
      setViewLoading(false);
    }
  };

  // ✅ NEW: Handle view student click
  const handleViewStudent = async (studentId) => {
    try {
      // Find student from current list
      const student = students.find(s => s._id === studentId);
      
      if (student) {
        setSelectedStudent(student);
        setViewStudentData(student); // Set initial data
        setShowViewModal(true);
        
        // Fetch detailed information
        fetchStudentDetails(studentId);
      } else {
        toast.error('Student not found in current list');
      }
    } catch (error) {
      console.error('View student error:', error);
      toast.error('Failed to view student details');
    }
  };

  // Fetch available courses
  const fetchCourses = async () => {
    try {
      console.log('📡 Fetching courses...');
      const response = await api.get('/admin/courses?status=active');
      
      if (response.data.success) {
        setCourses(response.data.data || []);
        console.log('✅ Courses fetched:', response.data.data?.length || 0);
      } else {
        toast.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('❌ Fetch courses error:', error);
      toast.error('Failed to load courses');
    }
  };

  // Fetch statistics - FIXED: Proper API call
  const fetchStats = async () => {
    try {
      console.log('📊 Fetching statistics...');
      const response = await api.get('/admin/students/stats');
      
      if (response.data.success) {
        console.log('✅ Stats response:', response.data.data);
        
        // Handle different response structures
        const statsData = response.data.data;
        
        if (statsData.overall) {
          // New structure
          setStats({
            overall: statsData.overall || { total: 0, active: 0, male: 0, female: 0 },
            courses: statsData.courses || [],
            semesters: statsData.semesters || []
          });
          
          // Extract course distribution
          if (statsData.courses) {
            setCourseDistribution(statsData.courses);
          } else if (statsData.overall && typeof statsData.overall === 'object') {
            // Legacy structure
            setStats(prev => ({
              ...prev,
              overall: {
                total: statsData.total || statsData.overall.total || 0,
                active: statsData.active || statsData.overall.active || 0,
                male: statsData.male || statsData.overall.male || 0,
                female: statsData.female || statsData.overall.female || 0
              }
            }));
          }
        } else {
          // Fallback: calculate from students data
          calculateStatsFromStudents();
        }
      } else {
        console.warn('Stats API returned success: false');
        calculateStatsFromStudents();
      }
    } catch (error) {
      console.error('❌ Fetch stats error:', error);
      toast.error('Failed to load statistics');
      calculateStatsFromStudents();
    }
  };

  // Calculate statistics from students data as fallback
  const calculateStatsFromStudents = () => {
    try {
      console.log('📊 Calculating stats from students data...');
      
      const total = students.length;
      const active = students.filter(s => s.academicStatus === 'Active').length;
      const male = students.filter(s => s.gender === 'Male').length;
      const female = students.filter(s => s.gender === 'Female').length;
      
      // Course distribution
      const courseDist = {};
      students.forEach(student => {
        const courseName = student.courseEnrolled?.courseName || 'Unknown';
        courseDist[courseName] = (courseDist[courseName] || 0) + 1;
      });
      
      setStats(prev => ({
        ...prev,
        overall: { total, active, male, female },
        courses: Object.keys(courseDist).map(course => ({
          courseName: course,
          count: courseDist[course]
        }))
      }));
      
      setCourseDistribution(Object.keys(courseDist).map(course => ({
        courseName: course,
        count: courseDist[course]
      })));
      
    } catch (err) {
      console.error('Error calculating stats:', err);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setNewStudent(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Check email if email field changed
    if (name === 'personalEmail' && value.includes('@')) {
      checkEmailExists(value);
    }

    // Check mobile if mobile field changed
    if (name === 'mobileNumber' && value.length === 10) {
      checkMobileExists(value);
    }
  };

  // Check if email already exists
  const checkEmailExists = async (email) => {
    if (!email || !email.includes('@')) return;
    
    setEmailChecking(true);
    try {
      const response = await api.get('/admin/students/check-email', {
        params: { email: email }
      });
      
      if (response.data.exists) {
        setFormErrors(prev => ({
          ...prev,
          personalEmail: `Email already exists! Student ID: ${response.data.existingStudentId || 'Unknown'}`
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          personalEmail: ''
        }));
      }
    } catch (error) {
      console.log('Email check failed:', error);
    } finally {
      setEmailChecking(false);
    }
  };

  // Check if mobile already exists
  const checkMobileExists = async (mobile) => {
    if (!mobile || mobile.length !== 10) return;
    
    try {
      const response = await api.get('/admin/students/check-mobile', {
        params: { mobile: mobile }
      });
      
      if (response.data.exists) {
        setFormErrors(prev => ({
          ...prev,
          mobileNumber: 'Mobile number already exists!'
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          mobileNumber: ''
        }));
      }
    } catch (error) {
      console.log('Mobile check failed:', error);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!newStudent.firstName.trim()) errors.firstName = 'First name is required';
    if (!newStudent.lastName.trim()) errors.lastName = 'Last name is required';
    
    if (!newStudent.personalEmail.trim()) {
      errors.personalEmail = 'Email is required';
    } else if (!emailRegex.test(newStudent.personalEmail)) {
      errors.personalEmail = 'Please enter a valid email address';
    }
    
    if (!newStudent.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile number is required';
    } else if (!mobileRegex.test(newStudent.mobileNumber)) {
      errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!newStudent.courseEnrolled) errors.courseEnrolled = 'Please select a course';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add student - FIXED VERSION
  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    console.log('📝 Adding student:', newStudent);

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // Prepare data exactly as backend expects
    const studentData = {
      firstName: newStudent.firstName.trim(),
      lastName: newStudent.lastName.trim(),
      personalEmail: newStudent.personalEmail.trim().toLowerCase(),
      mobileNumber: newStudent.mobileNumber.trim(),
      courseEnrolled: newStudent.courseEnrolled,
      gender: newStudent.gender || 'Male',
      dateOfBirth: newStudent.dateOfBirth || null,
      fatherName: newStudent.fatherName || '',
      fatherMobile: newStudent.fatherMobile || '',
      admissionYear: parseInt(newStudent.admissionYear) || new Date().getFullYear(),
      semester: parseInt(newStudent.semester) || 1
    };

    console.log('🚀 Sending to backend:', studentData);

    try {
      setLoading(true);
      const response = await api.post('/admin/students', studentData);
      
      console.log('✅ Backend Response:', response.data);
      
      if (response.data.success) {
        // Show generated credentials
        setGeneratedCredentials({
          studentId: response.data.data?.credentials?.studentId || 'Generated ID',
          instituteEmail: response.data.data?.credentials?.instituteEmail || 'email@institute.edu',
          password: response.data.data?.credentials?.password || 'password123',
          loginUrl: response.data.data?.credentials?.loginUrl || window.location.origin + '/login'
        });
        
        toast.success('Student added successfully!');
        setShowAddModal(false);
        setShowCredentialsModal(true);
        
        // Reset form
        resetForm();
        fetchStudents();
        fetchStats();
      } else {
        toast.error(response.data.message || 'Failed to add student');
      }
      
    } catch (error) {
      console.error('❌ Add Student Error:', error);
      
      let errorMessage = 'Failed to add student';
      
      if (error.response) {
        console.error('Error Response:', error.response.data);
        
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || 'Validation error';
        } else if (error.response.status === 404) {
          errorMessage = 'Endpoint not found. Check backend routes.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please check backend logs.';
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Is backend running?';
      } else {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk upload
  const handleBulkUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('bulkUploadFile');
    
    if (!fileInput.files[0]) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
      setLoading(true);
      const response = await api.post('/admin/students/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        toast.success(`Bulk upload completed: ${response.data.data.success} students added`);
        setShowBulkModal(false);
        fetchStudents();
        fetchStats();
      } else {
        toast.error(response.data.message || 'Upload failed');
      }
      
    } catch (error) {
      console.error('Bulk upload error:', error);
      toast.error(error.response?.data?.message || 'Bulk upload failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async () => {
    if (!selectedStudent) return;

    try {
      setLoading(true);
      const response = await api.post(`/admin/students/${selectedStudent._id}/reset-password`, resetPasswordData);
      
      if (response.data.success) {
        toast.success('Password reset successfully');
        setShowResetPasswordModal(false);
        
        if (resetPasswordData.sendEmail) {
          toast.success('New password sent to student email');
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete student
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      setLoading(true);
      const response = await api.delete(`/admin/students/${studentId}`);
      
      if (response.data.success) {
        toast.success('Student deleted successfully');
        fetchStudents();
        fetchStats();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete student');
    } finally {
      setLoading(false);
    }
  };

  // Generate sample data for testing
  const generateSampleData = () => {
    const firstNames = ['John', 'Jane', 'Robert', 'Mary', 'David', 'Sarah', 'Michael', 'Emma'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    
    const randomName = () => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return { firstName, lastName };
    };

    const { firstName, lastName } = randomName();
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@gmail.com`;
    
    setNewStudent({
      firstName: firstName,
      lastName: lastName,
      personalEmail: email,
      mobileNumber: `98765${Math.floor(Math.random() * 90000 + 10000)}`,
      courseEnrolled: courses.length > 0 ? courses[0]._id : '',
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      dateOfBirth: '2000-01-01',
      fatherName: `Mr. ${lastName}`,
      fatherMobile: `98765${Math.floor(Math.random() * 90000 + 10000)}`,
      admissionYear: new Date().getFullYear(),
      semester: 1
    });

    toast.success('Sample data filled!');
  };

  // Download template
  const downloadTemplate = () => {
    const template = `firstName,lastName,personalEmail,mobileNumber,courseCode,gender,fatherName,fatherMobile
John,Doe,john.doe@gmail.com,9876543210,GNM,Male,Robert Doe,9876543211
Jane,Smith,jane.smith@gmail.com,9876543211,ANM,Female,David Smith,9876543212
Robert,Johnson,robert.j@gmail.com,9876543212,GNM,Male,Michael Johnson,9876543213`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_upload_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export students to CSV - FIXED VERSION
  const exportStudents = async () => {
    try {
      setLoading(true);
      toast.loading('Preparing export...', { id: 'export' });
      
      // Try the dedicated export endpoint first
      try {
        const response = await api.get('/admin/students/export', {
          responseType: 'blob'
        });
        
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Get filename from headers or use default
        const contentDisposition = response.headers['content-disposition'];
        let filename = `students_${new Date().toISOString().split('T')[0]}.csv`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?(.+?)"?$/);
          if (match) {
            filename = match[1];
          }
        }
        
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('Students exported successfully', { id: 'export' });
        
      } catch (exportError) {
        console.log('Export endpoint failed, trying manual export...', exportError);
        
        // Fallback: Get all students and create CSV manually
        const response = await api.get('/admin/students', { 
          params: { 
            limit: 10000, // Get all students
            page: 1 
          } 
        });
        
        if (response.data.success) {
          const studentsData = response.data.data?.students || [];
          
          // Create CSV content
          let csvContent = 'Student ID,Full Name,Personal Email,Institute Email,Mobile Number,Course,Semester,Status,Admission Date\n';
          
          studentsData.forEach(student => {
            const row = [
              student.studentId || '',
              student.fullName || '',
              student.personalEmail || '',
              student.instituteEmail || '',
              student.mobileNumber || '',
              student.courseEnrolled?.courseName || '',
              student.semester || '',
              student.academicStatus || '',
              student.admissionDate ? new Date(student.admissionDate).toISOString().split('T')[0] : ''
            ];
            
            // Escape commas and quotes
            const escapedRow = row.map(field => {
              const str = String(field || '');
              if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return '"' + str.replace(/"/g, '""') + '"';
              }
              return str;
            });
            
            csvContent += escapedRow.join(',') + '\n';
          });
          
          // Create download
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast.success('Students exported successfully (manual export)', { id: 'export' });
          
        } else {
          throw new Error('Failed to fetch students for export');
        }
      }
      
    } catch (error) {
      console.error('❌ Export error:', error);
      toast.error(`Export failed: ${error.message}`, { id: 'export' });
      
      // Final fallback: Create empty template
      const template = 'Student ID,Full Name,Personal Email,Institute Email,Mobile Number,Course,Semester,Status,Admission Date\n';
      const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students_template.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewStudent({
      firstName: '',
      lastName: '',
      personalEmail: '',
      mobileNumber: '',
      courseEnrolled: '',
      gender: 'Male',
      dateOfBirth: '',
      fatherName: '',
      fatherMobile: '',
      admissionYear: new Date().getFullYear(),
      semester: 1
    });
    setFormErrors({});
  };

  // Copy credentials to clipboard
  const copyCredentials = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(err => toast.error('Failed to copy'));
  };

  // Generate random password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Print credentials
  const printCredentials = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Student Credentials - ${generatedCredentials.studentId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .credentials-card { border: 2px solid #333; padding: 20px; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .info-item { margin: 10px 0; padding: 10px; border-bottom: 1px solid #eee; }
            .highlight { background: #f8f9fa; padding: 10px; border-radius: 5px; }
            .important { color: #dc3545; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="credentials-card">
            <div class="header">
              <h2>Nursing Institute</h2>
              <h3>Student Login Credentials</h3>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="info-item">
              <strong>Student Name:</strong> ${newStudent.firstName} ${newStudent.lastName}
            </div>
            <div class="info-item">
              <strong>Student ID:</strong> ${generatedCredentials.studentId}
            </div>
            <div class="info-item highlight">
              <strong>Institute Email (Username):</strong> ${generatedCredentials.instituteEmail}
            </div>
            <div class="info-item highlight">
              <strong>Password:</strong> ${generatedCredentials.password}
            </div>
            <div class="info-item">
              <strong>Login URL:</strong> ${generatedCredentials.loginUrl}
            </div>
            <div class="info-item important">
              <strong>Important Instructions:</strong>
              <ul>
                <li>Use Institute Email as username to login</li>
                <li>Change your password after first login</li>
                <li>Keep these credentials secure and confidential</li>
                <li>Check institute email regularly for updates</li>
              </ul>
            </div>
            <div class="footer">
              <p>Best regards,<br>Nursing Institute Administration</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Send credentials via email
  const sendCredentialsEmail = async () => {
    try {
      await api.post('/admin/students/send-credentials', {
        studentId: generatedCredentials.studentId,
        email: newStudent.personalEmail,
        instituteEmail: generatedCredentials.instituteEmail,
        password: generatedCredentials.password
      });
      toast.success('Credentials sent to student email!');
    } catch (error) {
      console.error('Send email error:', error);
      toast.error('Failed to send email. Credentials copied to clipboard.');
    }
  };

  // Test API connection
  const testApiConnection = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      toast.success('✅ Backend is working!');
      console.log('API Test Success:', response.data);
    } catch (error) {
      toast.error('❌ Backend connection failed');
      console.error('API Test Error:', error);
    }
  };

  // Apply filters
  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchStudents();
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      course: '',
      semester: '',
      status: '',
      batch: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(() => fetchStudents(), 100);
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    fetchStudents();
  }, [pagination.page]);

  // Calculate percentages for stats cards
  const getPercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Get course name by ID
  const getCourseName = (courseId) => {
    if (!courseId) return 'Unknown';
    const course = courses.find(c => c._id === courseId);
    return course ? `${course.courseCode} - ${course.courseName}` : 'Unknown';
  };

  // ✅ NEW: Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // ✅ NEW: Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Completed': return 'primary';
      case 'On Leave': return 'warning';
      case 'Suspended': return 'danger';
      default: return 'secondary';
    }
  };

  // ✅ NEW: Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h3 className="mb-1">Student Management</h3>
          <p className="text-muted mb-0">Manage student admissions, profiles, and credentials</p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <FaUserPlus className="me-2" /> Add Student
          </Button>
          <Button variant="success" onClick={() => setShowBulkModal(true)}>
            <FaUpload className="me-2" /> Bulk Upload
          </Button>
          <Button variant="outline-secondary" onClick={exportStudents} disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : <><FaFileCsv className="me-2" /> Export CSV</>}
          </Button>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-primary shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-primary text-white rounded-circle p-3">
                    <FaUsers size={24} />
                  </div>
                </div>
                <div>
                  <h5 className="text-primary mb-1">{stats.overall?.total || 0}</h5>
                  <p className="text-muted mb-0">Total Students</p>
                  <small className="text-muted">
                    Active: {stats.overall?.active || 0}
                  </small>
                </div>
              </div>
              <ProgressBar 
                now={100} 
                variant="primary" 
                className="mt-2" 
                style={{ height: '3px' }}
              />
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-success shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-success text-white rounded-circle p-3">
                    <FaUserCheck size={24} />
                  </div>
                </div>
                <div>
                  <h5 className="text-success mb-1">{stats.overall?.active || 0}</h5>
                  <p className="text-muted mb-0">Active Students</p>
                  <small className="text-muted">
                    {getPercentage(stats.overall?.active || 0, stats.overall?.total || 0)}% of total
                  </small>
                </div>
              </div>
              <ProgressBar 
                now={getPercentage(stats.overall?.active || 0, stats.overall?.total || 0)} 
                variant="success" 
                className="mt-2"
                style={{ height: '3px' }}
              />
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-info shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-info text-white rounded-circle p-3">
                    <FaMars size={24} />
                  </div>
                </div>
                <div>
                  <h5 className="text-info mb-1">{stats.overall?.male || 0}</h5>
                  <p className="text-muted mb-0">Male Students</p>
                  <small className="text-muted">
                    {getPercentage(stats.overall?.male || 0, stats.overall?.total || 0)}% of total
                  </small>
                </div>
              </div>
              <ProgressBar 
                now={getPercentage(stats.overall?.male || 0, stats.overall?.total || 0)} 
                variant="info" 
                className="mt-2"
                style={{ height: '3px' }}
              />
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-warning shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-warning text-white rounded-circle p-3">
                    <FaVenus size={24} />
                  </div>
                </div>
                <div>
                  <h5 className="text-warning mb-1">{stats.overall?.female || 0}</h5>
                  <p className="text-muted mb-0">Female Students</p>
                  <small className="text-muted">
                    {getPercentage(stats.overall?.female || 0, stats.overall?.total || 0)}% of total
                  </small>
                </div>
              </div>
              <ProgressBar 
                now={getPercentage(stats.overall?.female || 0, stats.overall?.total || 0)} 
                variant="warning" 
                className="mt-2"
                style={{ height: '3px' }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Course Distribution */}
      {courseDistribution.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <FaChartBar className="me-2" />
                  Course Distribution
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {courseDistribution.slice(0, 4).map((course, index) => (
                    <Col md={3} key={index} className="mb-3">
                      <div className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0 text-truncate" title={course.courseName}>
                            {course.courseName || course._id || `Course ${index + 1}`}
                          </h6>
                          <Badge bg="primary">{course.count || 0}</Badge>
                        </div>
                        <ProgressBar 
                          now={getPercentage(course.count || 0, stats.overall?.total || 0)}
                          variant={index % 4 === 0 ? 'primary' : index % 4 === 1 ? 'success' : index % 4 === 2 ? 'info' : 'warning'}
                          className="mt-1"
                          style={{ height: '6px' }}
                        />
                        <small className="text-muted d-block mt-1">
                          {getPercentage(course.count || 0, stats.overall?.total || 0)}% of total
                        </small>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters Card */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <InputGroup>
                  <FormControl
                    placeholder="Name, ID, Email..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                  <Button variant="outline-secondary">
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Course</Form.Label>
                <Form.Select
                  value={filters.course}
                  onChange={(e) => setFilters({...filters, course: e.target.value})}
                >
                  <option value="">All Courses</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.courseName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Semester</Form.Label>
                <Form.Select
                  value={filters.semester}
                  onChange={(e) => setFilters({...filters, semester: e.target.value})}
                >
                  <option value="">All</option>
                  {[1,2,3,4,5,6].map(sem => (
                    <option key={sem} value={sem}>Sem {sem}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">All</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="On Leave">On Leave</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Batch Year</Form.Label>
                <Form.Control
                  type="number"
                  value={filters.batch}
                  onChange={(e) => setFilters({...filters, batch: e.target.value})}
                  min="2020"
                  max="2030"
                  placeholder="e.g., 2024"
                />
              </Form.Group>
            </Col>
            <Col md={1} className="d-flex align-items-end gap-2">
              <Button variant="primary" onClick={applyFilters}>
                <FaFilter /> Filter
              </Button>
              <Button variant="outline-secondary" onClick={clearFilters} title="Clear filters">
                <FaSync />
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Students Table */}
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Students List</h5>
          <div className="d-flex align-items-center">
            <span className="text-muted me-3">
              Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </span>
            <Button variant="outline-primary" size="sm" onClick={testApiConnection} title="Test API Connection">
              <FaCheck /> Test
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading students...</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover striped>
                  <thead className="table-dark">
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Course</th>
                      <th>Sem</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student._id}>
                        <td>
                          <strong className="text-primary">{student.studentId}</strong>
                          <div className="small text-muted">{student.instituteEmail}</div>
                        </td>
                        <td>
                          <div className="fw-semibold">{student.fullName}</div>
                          <div className="small text-muted">{student.personalEmail}</div>
                        </td>
                        <td>
                          <Badge bg="info" className="me-1">
                            {student.courseEnrolled?.courseCode || 'N/A'}
                          </Badge>
                          <div className="small">{student.courseEnrolled?.courseName || getCourseName(student.courseEnrolled)}</div>
                        </td>
                        <td>
                          <Badge bg="secondary">Sem {student.semester || 1}</Badge>
                        </td>
                        <td>
                          <div>{student.mobileNumber || 'N/A'}</div>
                          {student.fatherMobile && (
                            <div className="small text-muted">Father: {student.fatherMobile}</div>
                          )}
                        </td>
                        <td>
                          <Badge bg={
                            student.academicStatus === 'Active' ? 'success' :
                            student.academicStatus === 'Completed' ? 'primary' :
                            student.academicStatus === 'On Leave' ? 'warning' : 'secondary'
                          }>
                            {student.academicStatus || 'Active'}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            {/* ✅ VIEW BUTTON - Now with functionality */}
                            <Button 
                              size="sm" 
                              variant="outline-info" 
                              title="View Details"
                              onClick={() => handleViewStudent(student._id)}
                            >
                              <FaEye />
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline-warning" 
                              title="Edit"
                              onClick={() => {
                                setSelectedStudent(student);
                                setEditForm({
                                  firstName: student.firstName,
                                  lastName: student.lastName,
                                  mobileNumber: student.mobileNumber || '',
                                  contactNumber: student.contactNumber || '',
                                  address: student.address || '',
                                  guardianDetails: student.guardianDetails || '',
                                  courseEnrolled: student.courseEnrolled?._id || student.courseEnrolled || '',
                                  semester: student.semester || 1,
                                  academicStatus: student.academicStatus || 'Active'
                                });
                                setShowEditModal(true);
                              }}
                            >
                              <FaEdit />
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline-danger" 
                              title="Delete"
                              onClick={() => handleDeleteStudent(student._id)}
                            >
                              <FaTrash />
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline-dark" 
                              title="Reset Password"
                              onClick={() => {
                                setSelectedStudent(student);
                                setResetPasswordData({
                                  newPassword: generateRandomPassword(),
                                  sendEmail: true
                                });
                                setShowResetPasswordModal(true);
                              }}
                            >
                              <FaKey />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {students.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center py-5">
                          <div className="text-muted">
                            <h5>No students found</h5>
                            <p className="mb-3">Try adjusting your filters or add your first student</p>
                            <Button variant="primary" onClick={() => setShowAddModal(true)}>
                              <FaUserPlus className="me-2" /> Add First Student
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>
                          Previous
                        </button>
                      </li>
                      {[...Array(pagination.pages)].map((_, i) => {
                        // Show limited pages
                        if (
                          i === 0 ||
                          i === pagination.pages - 1 ||
                          (i >= pagination.page - 2 && i <= pagination.page + 2)
                        ) {
                          return (
                            <li key={i} className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}>
                              <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                {i + 1}
                              </button>
                            </li>
                          );
                        } else if (
                          i === 1 ||
                          i === pagination.pages - 2
                        ) {
                          return (
                            <li key={i} className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          );
                        }
                        return null;
                      })}
                      <li className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* =================== */}
      {/* VIEW STUDENT MODAL */}
      {/* =================== */}
      <Modal 
        show={showViewModal} 
        onHide={() => setShowViewModal(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>
            <FaEye className="me-2" /> Student Details
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {viewLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="info" />
              <p className="mt-3">Loading student details...</p>
            </div>
          ) : viewStudentData ? (
            <div className="student-details">
              {/* Header with ID and Status */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h4 className="mb-1">
                    {viewStudentData.firstName} {viewStudentData.lastName}
                  </h4>
                  <div className="d-flex align-items-center gap-3">
                    <Badge bg="primary" className="fs-6">
                      <FaIdBadge className="me-1" /> {viewStudentData.studentId}
                    </Badge>
                    <Badge bg={getStatusColor(viewStudentData.academicStatus)} className="fs-6">
                      {viewStudentData.academicStatus || 'Active'}
                    </Badge>
                  </div>
                </div>
                <div className="text-end">
                  <div className="text-muted small">Student Since</div>
                  <div className="fw-semibold">
                    {formatDate(viewStudentData.admissionDate)}
                  </div>
                </div>
              </div>

              <Row className="g-4">
                {/* Personal Information */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">
                        <FaUserGraduate className="me-2" /> Personal Information
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="info-item mb-3">
                        <div className="small text-muted mb-1">Full Name</div>
                        <div className="fw-semibold">
                          {viewStudentData.firstName} {viewStudentData.lastName}
                        </div>
                      </div>
                      
                      <div className="info-item mb-3">
                        <div className="small text-muted mb-1">Gender</div>
                        <div className="fw-semibold d-flex align-items-center">
                          {viewStudentData.gender === 'Male' ? (
                            <><FaMars className="me-2 text-primary" /> Male</>
                          ) : (
                            <><FaVenus className="me-2 text-pink" /> Female</>
                          )}
                        </div>
                      </div>
                      
                      <div className="info-item mb-3">
                        <div className="small text-muted mb-1">Date of Birth</div>
                        <div className="fw-semibold d-flex align-items-center">
                          <FaCalendarAlt className="me-2 text-secondary" />
                          {formatDate(viewStudentData.dateOfBirth)}
                          {viewStudentData.dateOfBirth && (
                            <Badge bg="light" text="dark" className="ms-2">
                              Age: {calculateAge(viewStudentData.dateOfBirth)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <div className="small text-muted mb-1">Email Addresses</div>
                        <div>
                          <div className="d-flex align-items-center mb-1">
                            <FaEnvelope className="me-2 text-primary" />
                            <div>
                              <div className="fw-semibold">Personal</div>
                              <div className="text-primary">{viewStudentData.personalEmail}</div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <FaEnvelopeOpen className="me-2 text-success" />
                            <div>
                              <div className="fw-semibold">Institute</div>
                              <div className="text-success">{viewStudentData.instituteEmail}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Contact & Course Information */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">
                        <FaPhone className="me-2" /> Contact & Course Details
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="info-item mb-3">
                        <div className="small text-muted mb-1">Mobile Number</div>
                        <div className="fw-semibold d-flex align-items-center">
                          <FaPhone className="me-2 text-success" />
                          {viewStudentData.mobileNumber || 'N/A'}
                        </div>
                      </div>
                      
                      <div className="info-item mb-3">
                        <div className="small text-muted mb-1">Father's Mobile</div>
                        <div className="fw-semibold">
                          {viewStudentData.fatherMobile || 'N/A'}
                        </div>
                      </div>
                      
                      <div className="info-item mb-4">
                        <div className="small text-muted mb-1">Father's Name</div>
                        <div className="fw-semibold">
                          {viewStudentData.fatherName || 'N/A'}
                        </div>
                      </div>
                      
                      <hr />
                      
                      <div className="info-item mb-3">
                        <div className="small text-muted mb-1">Course Enrolled</div>
                        <div className="fw-semibold d-flex align-items-center">
                          <FaBook className="me-2 text-warning" />
                          {viewStudentData.courseEnrolled?.courseName || getCourseName(viewStudentData.courseEnrolled)}
                        </div>
                        <div className="ms-4 mt-1">
                          <Badge bg="info" className="me-2">
                            {viewStudentData.courseEnrolled?.courseCode || 'N/A'}
                          </Badge>
                          <Badge bg="secondary">
                            Duration: {viewStudentData.courseEnrolled?.duration || 'N/A'} years
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <div className="small text-muted mb-1">Academic Details</div>
                        <div className="d-flex gap-3">
                          <div>
                            <div className="fw-semibold">Semester</div>
                            <Badge bg="primary" className="fs-6">
                              Sem {viewStudentData.semester || 'N/A'}
                            </Badge>
                          </div>
                          <div>
                            <div className="fw-semibold">Admission Year</div>
                            <div className="fw-semibold">{viewStudentData.admissionYear || 'N/A'}</div>
                          </div>
                          {viewStudentData.batch && (
                            <div>
                              <div className="fw-semibold">Batch</div>
                              <Badge bg="light" text="dark">
                                {viewStudentData.batch}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Additional Information */}
                <Col md={12}>
                  <Card>
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">
                        <FaUniversity className="me-2" /> Additional Information
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <div className="info-item mb-3">
                            <div className="small text-muted mb-1">Address</div>
                            <div className="fw-semibold d-flex align-items-start">
                              <FaMapMarkerAlt className="me-2 text-danger mt-1" />
                              <div>
                                {viewStudentData.address || 'Address not provided'}
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="info-item mb-3">
                            <div className="small text-muted mb-1">Guardian Details</div>
                            <div className="fw-semibold">
                              {viewStudentData.guardianDetails || 'Not provided'}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      
                      <div className="info-item">
                        <div className="small text-muted mb-1">Additional Notes</div>
                        <div className="fw-semibold">
                          {viewStudentData.notes || 'No additional notes'}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          ) : (
            <div className="text-center py-5">
              <FaTimes className="text-danger" size={48} />
              <h5 className="mt-3">Student details not found</h5>
              <p className="text-muted">Unable to load student information</p>
            </div>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <div>
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  if (viewStudentData) {
                    setSelectedStudent(viewStudentData);
                    setEditForm({
                      firstName: viewStudentData.firstName,
                      lastName: viewStudentData.lastName,
                      mobileNumber: viewStudentData.mobileNumber || '',
                      contactNumber: viewStudentData.contactNumber || '',
                      address: viewStudentData.address || '',
                      guardianDetails: viewStudentData.guardianDetails || '',
                      courseEnrolled: viewStudentData.courseEnrolled?._id || viewStudentData.courseEnrolled || '',
                      semester: viewStudentData.semester || 1,
                      academicStatus: viewStudentData.academicStatus || 'Active'
                    });
                    setShowViewModal(false);
                    setShowEditModal(true);
                  }
                }}
              >
                <FaEdit className="me-2" /> Edit Student
              </Button>
            </div>
            
            <div className="d-flex gap-2">
              <Button 
                variant="outline-dark"
                onClick={() => {
                  if (viewStudentData) {
                    setSelectedStudent(viewStudentData);
                    setResetPasswordData({
                      newPassword: generateRandomPassword(),
                      sendEmail: true
                    });
                    setShowViewModal(false);
                    setShowResetPasswordModal(true);
                  }
                }}
              >
                <FaKey className="me-2" /> Reset Password
              </Button>
              
              <Button 
                variant="outline-danger"
                onClick={() => {
                  if (viewStudentData && window.confirm('Are you sure you want to delete this student?')) {
                    handleDeleteStudent(viewStudentData._id);
                    setShowViewModal(false);
                  }
                }}
              >
                <FaTrash className="me-2" /> Delete
              </Button>
              
              <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      {/* =================== */}
      {/* ADD STUDENT MODAL */}
      {/* =================== */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FaUserPlus className="me-2" /> Add New Student
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddStudent}>
          <Modal.Body>
            <Alert variant="info" className="mb-4">
              <h6 className="mb-2">✅ Required Fields:</h6>
              <ol className="mb-0">
                <li>First Name</li>
                <li>Last Name</li>
                <li>Personal Email (Gmail)</li>
                <li>Mobile Number (10 digits)</li>
                <li>Course Selection</li>
              </ol>
            </Alert>

            <Row className="g-3">
              {/* First Name */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    name="firstName"
                    value={newStudent.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    isInvalid={!!formErrors.firstName}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Last Name */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    name="lastName"
                    value={newStudent.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    isInvalid={!!formErrors.lastName}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Personal Email */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Personal Email (Gmail) *</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="email"
                      name="personalEmail"
                      value={newStudent.personalEmail}
                      onChange={handleInputChange}
                      placeholder="student@gmail.com"
                      isInvalid={!!formErrors.personalEmail}
                      required
                    />
                    {emailChecking && (
                      <InputGroup.Text>
                        <Spinner size="sm" animation="border" />
                      </InputGroup.Text>
                    )}
                  </InputGroup>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.personalEmail}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Must be a valid Gmail address
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Mobile Number */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Mobile Number *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="mobileNumber"
                    value={newStudent.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    isInvalid={!!formErrors.mobileNumber}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.mobileNumber}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    10 digits only
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Course Enrolled */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Course Enrolled *</Form.Label>
                  <Form.Select
                    name="courseEnrolled"
                    value={newStudent.courseEnrolled}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.courseEnrolled}
                    required
                  >
                    <option value="">Select a course *</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.courseName} ({course.courseCode})
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.courseEnrolled}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Gender */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={newStudent.gender}
                    onChange={handleInputChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Date of Birth */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={newStudent.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              {/* Father's Name */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Father's Name</Form.Label>
                  <Form.Control
                    name="fatherName"
                    value={newStudent.fatherName}
                    onChange={handleInputChange}
                    placeholder="Father's full name"
                  />
                </Form.Group>
              </Col>

              {/* Father's Mobile */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Father's Mobile</Form.Label>
                  <Form.Control
                    type="tel"
                    name="fatherMobile"
                    value={newStudent.fatherMobile}
                    onChange={handleInputChange}
                    placeholder="Father's mobile number"
                  />
                </Form.Group>
              </Col>

              {/* Admission Year */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Admission Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="admissionYear"
                    value={newStudent.admissionYear}
                    onChange={handleInputChange}
                    min="2020"
                    max="2030"
                  />
                </Form.Group>
              </Col>

              {/* Semester */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Semester</Form.Label>
                  <Form.Control
                    type="number"
                    name="semester"
                    value={newStudent.semester}
                    onChange={handleInputChange}
                    min="1"
                    max="8"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Test Button */}
            <div className="text-center mt-4">
              <Button variant="outline-secondary" onClick={generateSampleData}>
                Fill Sample Data
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Adding Student...
                </>
              ) : (
                'Add Student'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* =================== */}
      {/* EDIT STUDENT MODAL */}
      {/* =================== */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton className="bg-warning text-white">
          <Modal.Title>
            <FaEdit className="me-2" /> Edit Student
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editForm ? (
            <Form>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      value={editForm.firstName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      value={editForm.lastName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      value={editForm.mobileNumber}
                      onChange={(e) => setEditForm(prev => ({ ...prev, mobileNumber: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                      value={editForm.contactNumber}
                      onChange={(e) => setEditForm(prev => ({ ...prev, contactNumber: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Course</Form.Label>
                    <Form.Select
                      value={editForm.courseEnrolled}
                      onChange={(e) => setEditForm(prev => ({ ...prev, courseEnrolled: e.target.value }))}
                    >
                      <option value="">Select a course</option>
                      {courses.map(c => (
                        <option key={c._id} value={c._id}>{c.courseName} ({c.courseCode})</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Semester</Form.Label>
                    <Form.Control
                      type="number"
                      value={editForm.semester}
                      onChange={(e) => setEditForm(prev => ({ ...prev, semester: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Academic Status</Form.Label>
                    <Form.Select
                      value={editForm.academicStatus}
                      onChange={(e) => setEditForm(prev => ({ ...prev, academicStatus: e.target.value }))}
                    >
                      <option>Active</option>
                      <option>On Leave</option>
                      <option>Completed</option>
                      <option>Suspended</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={editForm.address}
                      onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Guardian Details</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={editForm.guardianDetails}
                      onChange={(e) => setEditForm(prev => ({ ...prev, guardianDetails: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          ) : (
            <div className="text-center py-4">Loading...</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={savingEdit}>Cancel</Button>
          <Button variant="warning" onClick={async () => {
            if (!selectedStudent) return;
            try {
              setSavingEdit(true);
              const res = await api.put(`/admin/students/${selectedStudent._id}`, editForm);
              if (res.data?.success) {
                toast.success('Student updated');
                setShowEditModal(false);
                fetchStudents();
                fetchStats();
              } else {
                toast.error(res.data?.message || 'Failed to update');
              }
            } catch (error) {
              console.error('Update student error:', error.response?.data || error.message);
              toast.error('Failed to update student');
            } finally {
              setSavingEdit(false);
            }
          }} disabled={savingEdit}>
            {savingEdit ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =================== */}
      {/* BULK UPLOAD MODAL */}
      {/* =================== */}
      <Modal show={showBulkModal} onHide={() => setShowBulkModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Bulk Upload Students</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBulkUpload}>
          <Modal.Body>
            <Alert variant="info">
              <h6>Instructions:</h6>
              <ol className="mb-0">
                <li>Download the CSV template</li>
                <li>Fill student details</li>
                <li>Upload the CSV file</li>
                <li>System will generate Student IDs automatically</li>
              </ol>
            </Alert>

            <Form.Group>
              <Form.Label>Select CSV File</Form.Label>
              <Form.Control
                type="file"
                id="bulkUploadFile"
                accept=".csv"
                required
              />
              <Form.Text className="text-muted">
                Maximum 1000 records per file
              </Form.Text>
            </Form.Group>

            <div className="text-center mt-4">
              <Button variant="outline-secondary" onClick={downloadTemplate}>
                <FaDownload className="me-2" /> Download Template
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBulkModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="me-2" /> Upload
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* =================== */}
      {/* CREDENTIALS MODAL */}
      {/* =================== */}
      <Modal show={showCredentialsModal} onHide={() => setShowCredentialsModal(false)} size="lg">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>
            <FaIdCard className="me-2" /> Student Credentials Generated
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success" className="text-center">
            <h5 className="mb-0">🎉 Student Added Successfully!</h5>
            <p className="mb-0">Please save these credentials securely</p>
          </Alert>

          <Card className="mt-3">
            <Card.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Student Name</Form.Label>
                    <Form.Control
                      value={`${newStudent.firstName} ${newStudent.lastName}`}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Student ID</Form.Label>
                    <InputGroup>
                      <Form.Control
                        value={generatedCredentials.studentId}
                        readOnly
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => copyCredentials(generatedCredentials.studentId)}
                      >
                        <FaCopy />
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Institute Email (Username)</Form.Label>
                    <InputGroup>
                      <Form.Control
                        value={generatedCredentials.instituteEmail}
                        readOnly
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => copyCredentials(generatedCredentials.instituteEmail)}
                      >
                        <FaCopy />
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={generatedCredentials.password}
                        readOnly
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => copyCredentials(generatedCredentials.password)}
                      >
                        <FaCopy />
                      </Button>
                    </InputGroup>
                    <Form.Text className="text-danger">
                      ⚠️ This password will not be shown again!
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Login URL</Form.Label>
                    <InputGroup>
                      <Form.Control
                        value={generatedCredentials.loginUrl}
                        readOnly
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => copyCredentials(generatedCredentials.loginUrl)}
                      >
                        <FaCopy />
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <h6>Actions:</h6>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <Button variant="primary" onClick={() => copyCredentials(
                `Student ID: ${generatedCredentials.studentId}\n` +
                `Institute Email: ${generatedCredentials.instituteEmail}\n` +
                `Password: ${generatedCredentials.password}\n` +
                `Login URL: ${generatedCredentials.loginUrl}`
              )}>
                <FaCopy className="me-2" /> Copy All
              </Button>
              <Button variant="warning" onClick={printCredentials}>
                <FaPrint className="me-2" /> Print
              </Button>
              <Button variant="info" onClick={sendCredentialsEmail}>
                <FaEnvelope className="me-2" /> Send Email
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCredentialsModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setShowCredentialsModal(false);
            resetForm();
            setShowAddModal(true);
          }}>
            Add Another Student
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =================== */}
      {/* RESET PASSWORD MODAL */}
      {/* =================== */}
      <Modal show={showResetPasswordModal} onHide={() => setShowResetPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <>
              <p>
                Reset password for <strong>{selectedStudent.fullName}</strong>
              </p>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={resetPasswordData.newPassword}
                    onChange={(e) => setResetPasswordData({...resetPasswordData, newPassword: e.target.value})}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setResetPasswordData({
                      ...resetPasswordData,
                      newPassword: generateRandomPassword()
                    })}
                  >
                    Generate
                  </Button>
                </InputGroup>
              </Form.Group>
              <Form.Check
                type="checkbox"
                label="Send password to student's email"
                checked={resetPasswordData.sendEmail}
                onChange={(e) => setResetPasswordData({
                  ...resetPasswordData,
                  sendEmail: e.target.checked
                })}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetPasswordModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleResetPassword} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StudentManagement;