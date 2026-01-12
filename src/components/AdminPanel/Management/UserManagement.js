import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Modal,
  Badge,
  Alert,
  Spinner,
  InputGroup,
  Tabs,
  Tab,
  Pagination,
  Dropdown
} from 'react-bootstrap';
import {
  FaUser,
  FaUserShield,
  FaUserGraduate,
  FaEdit,
  FaTrash,
  FaKey,
  FaSearch,
  FaFilter,
  FaEye,
  FaSync,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaCalendar,
  FaBook,
  FaInfoCircle,
  FaTimes,
  FaPlus,
  FaCheck,
  FaTimesCircle,
  FaDownload,
  FaUpload,
  FaCog,
  FaBan,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import api from '../../../services/api';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  
  // Courses for student enrollment
  const [courses, setCourses] = useState([]);
  
  // New user form
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student',
    fullName: '',
    contactNumber: '',
    isActive: true,
    courseEnrolled: '',
    batchYear: new Date().getFullYear(),
    semester: 1,
    designation: 'Lecturer',
    department: 'Medical-Surgical Nursing'
  });

  // Reset password form
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: '',
    sendEmail: false
  });

  // Bulk upload
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkResults, setBulkResults] = useState(null);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    students: 0,
    faculty: 0,
    admins: 0
  });

  useEffect(() => {
    checkApiConnection();
    fetchUsers();
    fetchCourses();
  }, [pagination.page, filterRole, filterStatus]);

  useEffect(() => {
    filterUsers();
    calculateStats();
  }, [users, searchTerm]);

  const checkApiConnection = async () => {
    try {
      const response = await api.get('/health');
      if (response.data.status === 'success') {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      setApiStatus('disconnected');
      console.warn('API connection failed:', error.message);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filterRole && { role: filterRole }),
        ...(filterStatus && { status: filterStatus }),
        ...(searchTerm && { search: searchTerm })
      };

      console.log('Fetching users with params:', params);

      const response = await api.get('/admin/users', { params });
      console.log('Users API response:', response.data);
      
      if (response.data.success) {
        const usersData = response.data.data || [];
        setUsers(usersData);
        setFilteredUsers(usersData);
        
        // Update pagination
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        } else {
          setPagination(prev => ({
            ...prev,
            total: response.data.count || usersData.length,
            pages: Math.ceil((response.data.count || usersData.length) / prev.limit)
          }));
        }
        
        toast.success(`Loaded ${usersData.length} users`);
      } else {
        toast.error(response.data.message || 'Failed to fetch users');
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      
      let errorMessage = 'Failed to fetch users';
      if (error.response) {
        errorMessage = `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server';
      } else {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      // Fallback to empty data
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/public/courses');
      if (response.data.success) {
        setCourses(response.data.data || []);
      }
    } catch (error) {
      console.warn('Failed to fetch courses:', error);
      // Mock courses for fallback
      setCourses([
        { _id: '1', courseName: 'GNM Nursing', courseCode: 'GNM' },
        { _id: '2', courseName: 'ANM Nursing', courseCode: 'ANM' },
        { _id: '3', courseName: 'B.Sc Nursing', courseCode: 'BSCN' }
      ]);
    }
  };

  const calculateStats = () => {
    const total = users.length;
    const active = users.filter(u => u.isActive).length;
    const students = users.filter(u => u.role === 'student').length;
    const faculty = users.filter(u => u.role === 'faculty').length;
    const admins = users.filter(u => u.role === 'admin').length;
    
    setStats({ total, active, students, faculty, admins });
  };

  const filterUsers = () => {
    let filtered = users;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => {
        const searchFields = [
          user.username,
          user.email,
          user.profile?.fullName,
          user.profile?.studentId,
          user.profile?.facultyId,
          user.profile?.employeeId,
          user.profile?.contactNumber
        ].filter(Boolean);
        
        return searchFields.some(field => 
          field.toString().toLowerCase().includes(term)
        );
      });
    }
    
    setFilteredUsers(filtered);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Validate required fields
      if (!newUser.username || !newUser.email || !newUser.fullName) {
        toast.error('Username, email, and full name are required');
        setSaving(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newUser.email)) {
        toast.error('Please enter a valid email address');
        setSaving(false);
        return;
      }

      // Prepare user data
      const userData = {
        username: newUser.username.trim(),
        email: newUser.email.trim(),
        password: newUser.password || undefined,
        role: newUser.role,
        fullName: newUser.fullName.trim(),
        contactNumber: newUser.contactNumber.trim(),
        isActive: newUser.isActive
      };

      // Add role-specific data
      if (newUser.role === 'student') {
        if (!newUser.courseEnrolled) {
          toast.error('Please select a course for student');
          setSaving(false);
          return;
        }
        userData.courseEnrolled = newUser.courseEnrolled;
        userData.batchYear = parseInt(newUser.batchYear);
        userData.semester = parseInt(newUser.semester);
      } else if (newUser.role === 'faculty') {
        userData.designation = newUser.designation;
        userData.department = newUser.department;
      } else if (newUser.role === 'admin') {
        userData.designation = newUser.designation;
        userData.department = newUser.department;
      }

      console.log('Creating user with data:', userData);

      const response = await api.post('/admin/users', userData);
      
      if (response.data.success) {
        const createdUser = {
          ...response.data.data.user,
          profile: response.data.data.profile,
          createdAt: new Date().toISOString()
        };
        
        // Add to local state
        setUsers(prev => [createdUser, ...prev]);
        
        // Show success message with credentials
        let message = (
          <div>
            <strong>✅ User created successfully!</strong>
            <br />
            <small>
              Name: {createdUser.profile?.fullName || createdUser.username}
            </small>
          </div>
        );
        
        if (response.data.data.credentials) {
          message = (
            <div>
              <strong>✅ User created successfully!</strong>
              <br />
              <small>
                Username: <code>{response.data.data.credentials.username}</code>
                <br />
                Password: <code>{response.data.data.credentials.password}</code>
                <br />
                <span className="text-warning">Save these credentials!</span>
              </small>
            </div>
          );
        }
        
        toast.success(message, { duration: 8000 });
        
        // Reset form and close modal
        resetNewUserForm();
        setShowAddModal(false);
        
        // Refresh users list
        fetchUsers();
      } else {
        toast.error(response.data.message || 'Failed to create user');
      }
      
    } catch (error) {
      console.error('Add user error:', error);
      
      let errorMessage = 'Failed to create user';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Bad request. Check your input data.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Unauthorized. Please login again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Forbidden. You do not have permission.';
      } else if (error.response?.status === 409) {
        errorMessage = 'User already exists with this email or username.';
      }
      
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    
    setSaving(true);
    try {
      const updates = {
        username: editingUser.username,
        email: editingUser.email,
        fullName: editingUser.fullName,
        contactNumber: editingUser.contactNumber,
        isActive: editingUser.isActive
      };

      // Add role-specific updates
      if (editingUser.role === 'student') {
        updates.courseEnrolled = editingUser.courseEnrolled;
        updates.batchYear = editingUser.batchYear;
        updates.semester = editingUser.semester;
        updates.academicStatus = editingUser.academicStatus;
      } else if (editingUser.role === 'faculty') {
        updates.designation = editingUser.designation;
        updates.department = editingUser.department;
      } else if (editingUser.role === 'admin') {
        updates.designation = editingUser.designation;
        updates.department = editingUser.department;
      }

      const response = await api.put(`/admin/users/${editingUser._id}`, updates);
      
      if (response.data.success) {
        // Update local state
        setUsers(prev => prev.map(user => 
          user._id === editingUser._id ? { ...user, ...response.data.data } : user
        ));
        
        toast.success('User updated successfully');
        setShowEditModal(false);
        setEditingUser(null);
      } else {
        toast.error(response.data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Edit user error:', error);
      toast.error('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const resetNewUserForm = () => {
    setNewUser({
      username: '',
      email: '',
      password: '',
      role: 'student',
      fullName: '',
      contactNumber: '',
      isActive: true,
      courseEnrolled: '',
      batchYear: new Date().getFullYear(),
      semester: 1,
      designation: 'Lecturer',
      department: 'Medical-Surgical Nursing'
    });
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await api.delete(`/admin/users/${id}`);
      
      if (response.data.success) {
        // Remove from local state
        setUsers(prev => prev.filter(user => user._id !== id));
        toast.success('User deleted successfully');
      } else {
        toast.error(response.data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const response = await api.patch(`/admin/users/${id}/toggle-active`);
      
      if (response.data.success) {
        // Update local state
        setUsers(prev => prev.map(user => 
          user._id === id ? { ...user, isActive: response.data.data.isActive } : user
        ));
        
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Toggle active error:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    
    setSaving(true);
    try {
      const response = await api.post(`/admin/users/${selectedUser._id}/reset-password`, resetPasswordData);
      
      if (response.data.success) {
        toast.success(
          <div>
            ✅ Password reset successfully!
            <br />
            <small>
              New password: <code>{response.data.data.password || resetPasswordData.newPassword}</code>
              <br />
              {resetPasswordData.sendEmail ? 'Email sent to user' : 'Please inform user manually'}
            </small>
          </div>,
          { duration: 8000 }
        );
        
        setShowResetModal(false);
        setResetPasswordData({
          newPassword: '',
          sendEmail: false
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Failed to reset password');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) {
      toast.error('Please select a file');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', bulkFile);

      const response = await api.post('/admin/students/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setBulkResults(response.data.data);
        toast.success(`Bulk upload completed: ${response.data.data.success} successful, ${response.data.data.failed} failed`);
        
        // Refresh users list
        fetchUsers();
        
        // Clear file and close modal after delay
        setTimeout(() => {
          setBulkFile(null);
          setShowBulkModal(false);
        }, 3000);
      } else {
        toast.error(response.data.message || 'Bulk upload failed');
      }
    } catch (error) {
      console.error('Bulk upload error:', error);
      toast.error('Failed to process bulk upload');
    } finally {
      setSaving(false);
    }
  };

  const downloadTemplate = () => {
    const template = `username,email,password,role,fullName,contactNumber,courseEnrolled,batchYear,semester,designation,department,isActive
student1@example.com,student1@example.com,password123,student,John Doe,9876543210,COURSE_ID,2024,1,,,true
faculty1@example.com,faculty1@example.com,password123,faculty,Dr. Jane Smith,9876543211,,,Professor,Medical-Surgical Nursing,true
admin1@example.com,admin1@example.com,password123,admin,Admin User,9876543212,,,Administrator,Administration,true`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Template downloaded');
  };

  const generateRandomPassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <FaUserShield className="text-danger" />;
      case 'faculty': return <FaUserGraduate className="text-warning" />;
      case 'student': return <FaUser className="text-primary" />;
      default: return <FaUser className="text-secondary" />;
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      'admin': 'danger',
      'faculty': 'warning',
      'student': 'primary'
    };
    return badges[role] || 'secondary';
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 
      <Badge bg="success"><FaCheck className="me-1" /> Active</Badge> : 
      <Badge bg="danger"><FaTimesCircle className="me-1" /> Inactive</Badge>;
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterRole('');
    setFilterStatus('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const exportUsers = () => {
    const data = filteredUsers.map(user => ({
      ID: user._id,
      Username: user.username,
      Email: user.email,
      Role: user.role,
      Name: user.profile?.fullName || '',
      Status: user.isActive ? 'Active' : 'Inactive',
      Created: new Date(user.createdAt).toLocaleDateString(),
      ...(user.role === 'student' && {
        StudentID: user.profile?.studentId || '',
        Course: user.profile?.courseEnrolled?.courseName || '',
        Batch: user.profile?.batchYear || '',
        Semester: user.profile?.semester || ''
      }),
      ...(user.role === 'faculty' && {
        FacultyID: user.profile?.facultyId || '',
        Designation: user.profile?.designation || '',
        Department: user.profile?.department || ''
      }),
      ...(user.role === 'admin' && {
        EmployeeID: user.profile?.employeeId || '',
        Designation: user.profile?.designation || '',
        Department: user.profile?.department || ''
      })
    }));

    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success(`Exported ${data.length} users`);
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0] || {});
    const rows = data.map(row => 
      headers.map(header => JSON.stringify(row[header] || '')).join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  };

  const openEditModal = (user) => {
    setEditingUser({
      ...user,
      fullName: user.profile?.fullName || '',
      contactNumber: user.profile?.contactNumber || '',
      courseEnrolled: user.profile?.courseEnrolled?._id || user.profile?.courseEnrolled || '',
      batchYear: user.profile?.batchYear || new Date().getFullYear(),
      semester: user.profile?.semester || 1,
      academicStatus: user.profile?.academicStatus || 'Active',
      designation: user.profile?.designation || 'Lecturer',
      department: user.profile?.department || 'Medical-Surgical Nursing'
    });
    setShowEditModal(true);
  };

  return (
    <Container fluid className="py-4">
      {/* API Status Indicator */}
      <Row className="mb-3">
        <Col>
          <Alert variant={apiStatus === 'connected' ? 'success' : 'warning'} className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              {apiStatus === 'connected' ? (
                <FaCheckCircle className="me-2" />
              ) : (
                <FaExclamationTriangle className="me-2" />
              )}
              <div>
                <strong>
                  {apiStatus === 'connected' ? 'Connected to Database' : 'Development Mode'}
                </strong>
                <div className="small">
                  {apiStatus === 'connected' 
                    ? 'Data is being saved to MongoDB database' 
                    : 'Using fallback data. Check backend connection.'}
                </div>
              </div>
            </div>
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={checkApiConnection}
              title="Test backend connection"
            >
              <FaSync /> Test Connection
            </Button>
          </Alert>
        </Col>
      </Row>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1">User Management</h2>
          <p className="text-muted mb-0">
            Manage all users: Students, Faculty, and Administrators
            {apiStatus !== 'connected' && ' (Using local data)'}
          </p>
        </div>
        <div className="d-flex gap-2">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary">
              <FaCog className="me-2" /> Actions
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={exportUsers}>
                <FaDownload className="me-2" /> Export Users
              </Dropdown.Item>
              <Dropdown.Item onClick={downloadTemplate}>
                <FaDownload className="me-2" /> Download Template
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowBulkModal(true)}>
                <FaUpload className="me-2" /> Bulk Upload
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={clearFilters}>
                <FaFilter className="me-2" /> Clear Filters
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button 
            variant="outline-secondary" 
            onClick={fetchUsers}
            disabled={loading}
          >
            <FaSync className={`me-2 ${loading ? 'fa-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="primary" 
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus className="me-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col md={2}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Total Users</h6>
                  <h3 className="mb-0">{stats.total}</h3>
                </div>
                <FaUser size={20} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={2}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Active</h6>
                  <h3 className="mb-0">{stats.active}</h3>
                </div>
                <FaCheck size={20} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={2}>
          <Card className="border-0 shadow-sm bg-warning text-dark">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Students</h6>
                  <h3 className="mb-0">{stats.students}</h3>
                </div>
                <FaUserGraduate size={20} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={2}>
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Faculty</h6>
                  <h3 className="mb-0">{stats.faculty}</h3>
                </div>
                <FaUserGraduate size={20} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={2}>
          <Card className="border-0 shadow-sm bg-danger text-white">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Admins</h6>
                  <h3 className="mb-0">{stats.admins}</h3>
                </div>
                <FaUserShield size={20} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={2}>
          <Card className="border-0 shadow-sm bg-secondary text-white">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Inactive</h6>
                  <h3 className="mb-0">{stats.total - stats.active}</h3>
                </div>
                <FaBan size={20} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search Users</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search by name, email, ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button
                      variant="outline-secondary"
                      onClick={() => setSearchTerm('')}
                    >
                      <FaTimes />
                    </Button>
                  )}
                </InputGroup>
              </Form.Group>
            </Col>
            
            <Col md={2}>
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={filterRole}
                  onChange={(e) => {
                    setFilterRole(e.target.value);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                >
                  <option value="">All Roles</option>
                  <option value="student">Students</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admins</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={2}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={2}>
              <Form.Group>
                <Form.Label>Per Page</Form.Label>
                <Form.Select
                  value={pagination.limit}
                  onChange={(e) => {
                    setPagination(prev => ({ 
                      ...prev, 
                      limit: parseInt(e.target.value), 
                      page: 1 
                    }));
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={2}>
              <Form.Group>
                <Button
                  variant="outline-danger"
                  onClick={clearFilters}
                  className="w-100"
                >
                  <FaTimes className="me-2" />
                  Clear
                </Button>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          {loading && users.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading users from database...</p>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  Users ({filteredUsers.length} of {stats.total})
                </h5>
                <small className="text-muted">
                  Page {pagination.page} of {pagination.pages} • 
                  Showing {filteredUsers.length} users
                </small>
              </div>
              
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>User Details</th>
                      <th>Username/ID</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, index) => (
                        <tr key={user._id}>
                          <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                {getRoleIcon(user.role)}
                              </div>
                              <div>
                                <div className="fw-semibold">
                                  {user.profile?.fullName || user.username}
                                </div>
                                <div className="small text-muted">
                                  <FaEnvelope className="me-1" size={12} />
                                  {user.email}
                                </div>
                                {user.profile?.contactNumber && (
                                  <div className="small text-muted">
                                    <FaPhone className="me-1" size={12} />
                                    {user.profile.contactNumber}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-column">
                              <code className="mb-1">{user.username}</code>
                              {user.profile?.studentId && (
                                <small className="text-primary">
                                  <FaIdCard className="me-1" />
                                  {user.profile.studentId}
                                </small>
                              )}
                              {user.profile?.facultyId && (
                                <small className="text-warning">
                                  <FaIdCard className="me-1" />
                                  {user.profile.facultyId}
                                </small>
                              )}
                              {user.profile?.employeeId && (
                                <small className="text-danger">
                                  <FaIdCard className="me-1" />
                                  {user.profile.employeeId}
                                </small>
                              )}
                            </div>
                          </td>
                          <td>
                            <Badge bg={getRoleBadge(user.role)} className="px-3 py-2 mb-1">
                              {user.role.toUpperCase()}
                            </Badge>
                            {user.profile?.courseEnrolled?.courseName && (
                              <div className="small mt-1">
                                <FaBook className="me-1" size={10} />
                                {user.profile.courseEnrolled.courseName}
                              </div>
                            )}
                            {user.profile?.designation && (
                              <div className="small mt-1">{user.profile.designation}</div>
                            )}
                            {user.profile?.department && (
                              <div className="small text-muted">{user.profile.department}</div>
                            )}
                          </td>
                          <td>
                            {getStatusBadge(user.isActive)}
                            {user.profile?.academicStatus && (
                              <div className="small mt-2">
                                <Badge bg="info">
                                  {user.profile.academicStatus}
                                </Badge>
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="small">
                              <FaCalendar className="me-1" />
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                            <div className="small text-muted">
                              {new Date(user.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowViewModal(true);
                                }}
                                title="View Details"
                              >
                                <FaEye />
                              </Button>
                              
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => openEditModal(user)}
                                title="Edit User"
                              >
                                <FaEdit />
                              </Button>
                              
                              <Button
                                variant={user.isActive ? "outline-warning" : "outline-success"}
                                size="sm"
                                onClick={() => handleToggleActive(user._id)}
                                title={user.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {user.isActive ? <FaTimesCircle /> : <FaCheck />}
                              </Button>
                              
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setResetPasswordData({
                                    newPassword: generateRandomPassword(),
                                    sendEmail: false
                                  });
                                  setShowResetModal(true);
                                }}
                                title="Reset Password"
                              >
                                <FaKey />
                              </Button>
                              
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteUser(user._id)}
                                title="Delete User"
                                disabled={user.role === 'admin' && user.username === 'admin'}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-5">
                          <FaUser size={48} className="text-muted mb-3 opacity-50" />
                          <h5 className="text-muted">No users found</h5>
                          <p className="text-muted mb-3">Try changing your search or filters</p>
                          <Button
                            variant="primary"
                            onClick={() => setShowAddModal(true)}
                          >
                            <FaPlus className="me-2" />
                            Add Your First User
                          </Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="text-muted small">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, stats.total)} of{' '}
                    {stats.total} entries
                  </div>
                  <Pagination>
                    <Pagination.First 
                      onClick={() => handlePageChange(1)} 
                      disabled={pagination.page === 1}
                    />
                    <Pagination.Prev 
                      onClick={() => handlePageChange(pagination.page - 1)} 
                      disabled={pagination.page === 1}
                    />
                    
                    {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <Pagination.Item
                          key={pageNum}
                          active={pageNum === pagination.page}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Pagination.Item>
                      );
                    })}
                    
                    <Pagination.Next 
                      onClick={() => handlePageChange(pagination.page + 1)} 
                      disabled={pagination.page === pagination.pages}
                    />
                    <Pagination.Last 
                      onClick={() => handlePageChange(pagination.pages)} 
                      disabled={pagination.page === pagination.pages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Add User Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddUser}>
          <Modal.Body>
            <Tabs defaultActiveKey="basic" className="mb-3">
              <Tab eventKey="basic" title="Basic Information">
                <Row className="g-3 mt-2">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Full Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter full name"
                        value={newUser.fullName}
                        onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Email <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="user@example.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Username <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Choose username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                        required
                      />
                      <Form.Text className="text-muted">
                        This will be used for login
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="Leave empty for auto-generate"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setNewUser({
                            ...newUser,
                            password: generateRandomPassword()
                          })}
                        >
                          Generate
                        </Button>
                      </InputGroup>
                      {newUser.password && (
                        <Form.Text className="text-muted">
                          Password: <code>{newUser.password}</code>
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Role <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        required
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Contact Number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="9876543210"
                        value={newUser.contactNumber}
                        onChange={(e) => setNewUser({...newUser, contactNumber: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>
              
              {newUser.role === 'student' && (
                <Tab eventKey="student" title="Student Details">
                  <Row className="g-3 mt-2">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Course <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={newUser.courseEnrolled}
                          onChange={(e) => setNewUser({...newUser, courseEnrolled: e.target.value})}
                          required
                        >
                          <option value="">Select Course</option>
                          {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                              {course.courseName} ({course.courseCode})
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>
                          Batch Year <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          min="2000"
                          max="2030"
                          value={newUser.batchYear}
                          onChange={(e) => setNewUser({...newUser, batchYear: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>
                          Semester <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={newUser.semester}
                          onChange={(e) => setNewUser({...newUser, semester: parseInt(e.target.value)})}
                          required
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <option key={sem} value={sem}>Semester {sem}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>
              )}
              
              {(newUser.role === 'faculty' || newUser.role === 'admin') && (
                <Tab eventKey="professional" title="Professional Details">
                  <Row className="g-3 mt-2">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Designation <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={newUser.designation}
                          onChange={(e) => setNewUser({...newUser, designation: e.target.value})}
                          required
                        >
                          {newUser.role === 'faculty' ? (
                            <>
                              <option value="Lecturer">Lecturer</option>
                              <option value="Assistant Professor">Assistant Professor</option>
                              <option value="Associate Professor">Associate Professor</option>
                              <option value="Professor">Professor</option>
                              <option value="Clinical Instructor">Clinical Instructor</option>
                            </>
                          ) : (
                            <>
                              <option value="Administrator">Administrator</option>
                              <option value="Principal">Principal</option>
                              <option value="Vice Principal">Vice Principal</option>
                              <option value="Registrar">Registrar</option>
                              <option value="Accountant">Accountant</option>
                            </>
                          )}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Department <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={newUser.department}
                          onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                          required
                        >
                          {newUser.role === 'faculty' ? (
                            <>
                              <option value="Medical-Surgical Nursing">Medical-Surgical Nursing</option>
                              <option value="Pediatric Nursing">Pediatric Nursing</option>
                              <option value="Psychiatric Nursing">Psychiatric Nursing</option>
                              <option value="Community Health Nursing">Community Health Nursing</option>
                              <option value="Obstetric Nursing">Obstetric Nursing</option>
                            </>
                          ) : (
                            <>
                              <option value="Administration">Administration</option>
                              <option value="Accounts">Accounts</option>
                              <option value="Examination">Examination</option>
                              <option value="Admission">Admission</option>
                              <option value="IT">IT Department</option>
                            </>
                          )}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>
              )}
            </Tabs>
            
            <Form.Group className="mt-3">
              <Form.Check
                type="checkbox"
                label="Active Account"
                checked={newUser.isActive}
                onChange={(e) => setNewUser({...newUser, isActive: e.target.checked})}
              />
              <Form.Text className="text-muted">
                Inactive users cannot login to the system
              </Form.Text>
            </Form.Group>
            
            <Alert variant="info" className="mt-3">
              <FaInfoCircle className="me-2" />
              <strong>Note:</strong> Student ID, Faculty ID, or Employee ID will be auto-generated.
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Creating User...
                </>
              ) : 'Create User'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        {editingUser && (
          <Form onSubmit={handleEditUser}>
            <Modal.Body>
              <Tabs defaultActiveKey="basic" className="mb-3">
                <Tab eventKey="basic" title="Basic Information">
                  <Row className="g-3 mt-2">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Full Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={editingUser.fullName}
                          onChange={(e) => setEditingUser({...editingUser, fullName: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Email <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          value={editingUser.email}
                          onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Username <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={editingUser.username}
                          onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control
                          type="tel"
                          value={editingUser.contactNumber}
                          onChange={(e) => setEditingUser({...editingUser, contactNumber: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>
                
                {editingUser.role === 'student' && (
                  <Tab eventKey="student" title="Student Details">
                    <Row className="g-3 mt-2">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            Course <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            value={editingUser.courseEnrolled}
                            onChange={(e) => setEditingUser({...editingUser, courseEnrolled: e.target.value})}
                            required
                          >
                            <option value="">Select Course</option>
                            {courses.map((course) => (
                              <option key={course._id} value={course._id}>
                                {course.courseName} ({course.courseCode})
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>
                            Batch Year <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="number"
                            value={editingUser.batchYear}
                            onChange={(e) => setEditingUser({...editingUser, batchYear: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>
                            Semester <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            value={editingUser.semester}
                            onChange={(e) => setEditingUser({...editingUser, semester: parseInt(e.target.value)})}
                            required
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                              <option key={sem} value={sem}>Semester {sem}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Academic Status</Form.Label>
                          <Form.Select
                            value={editingUser.academicStatus}
                            onChange={(e) => setEditingUser({...editingUser, academicStatus: e.target.value})}
                          >
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Discontinued">Discontinued</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>
                )}
              </Tabs>
              
              <Form.Group className="mt-3">
                <Form.Check
                  type="checkbox"
                  label="Active Account"
                  checked={editingUser.isActive}
                  onChange={(e) => setEditingUser({...editingUser, isActive: e.target.checked})}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Updating...
                  </>
                ) : 'Update User'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal>

      {/* View User Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <div>
              <div className="text-center mb-4">
                <div className="mb-3">
                  {getRoleIcon(selectedUser.role)}
                </div>
                <h5>{selectedUser.profile?.fullName || selectedUser.username}</h5>
                <Badge bg={getRoleBadge(selectedUser.role)} className="mb-2">
                  {selectedUser.role.toUpperCase()}
                </Badge>
                {getStatusBadge(selectedUser.isActive)}
              </div>
              
              <hr />
              
              <Row>
                <Col md={6} className="mb-3">
                  <strong>Username:</strong>
                  <div className="text-muted">{selectedUser.username}</div>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Email:</strong>
                  <div className="text-muted">{selectedUser.email}</div>
                </Col>
                
                {selectedUser.profile?.contactNumber && (
                  <Col md={6} className="mb-3">
                    <strong>Contact:</strong>
                    <div className="text-muted">{selectedUser.profile.contactNumber}</div>
                  </Col>
                )}
                
                {selectedUser.profile?.studentId && (
                  <Col md={6} className="mb-3">
                    <strong>Student ID:</strong>
                    <div className="text-muted">{selectedUser.profile.studentId}</div>
                  </Col>
                )}
                
                {selectedUser.profile?.facultyId && (
                  <Col md={6} className="mb-3">
                    <strong>Faculty ID:</strong>
                    <div className="text-muted">{selectedUser.profile.facultyId}</div>
                  </Col>
                )}
                
                {selectedUser.profile?.employeeId && (
                  <Col md={6} className="mb-3">
                    <strong>Employee ID:</strong>
                    <div className="text-muted">{selectedUser.profile.employeeId}</div>
                  </Col>
                )}
                
                {selectedUser.profile?.designation && (
                  <Col md={6} className="mb-3">
                    <strong>Designation:</strong>
                    <div className="text-muted">{selectedUser.profile.designation}</div>
                  </Col>
                )}
                
                {selectedUser.profile?.department && (
                  <Col md={6} className="mb-3">
                    <strong>Department:</strong>
                    <div className="text-muted">{selectedUser.profile.department}</div>
                  </Col>
                )}
                
                {selectedUser.profile?.courseEnrolled?.courseName && (
                  <Col md={6} className="mb-3">
                    <strong>Course:</strong>
                    <div className="text-muted">{selectedUser.profile.courseEnrolled.courseName}</div>
                  </Col>
                )}
                
                {selectedUser.profile?.batchYear && (
                  <Col md={6} className="mb-3">
                    <strong>Batch Year:</strong>
                    <div className="text-muted">{selectedUser.profile.batchYear}</div>
                  </Col>
                )}
                
                {selectedUser.profile?.semester && (
                  <Col md={6} className="mb-3">
                    <strong>Semester:</strong>
                    <div className="text-muted">{selectedUser.profile.semester}</div>
                  </Col>
                )}
                
                {selectedUser.profile?.academicStatus && (
                  <Col md={6} className="mb-3">
                    <strong>Academic Status:</strong>
                    <div className="text-muted">
                      <Badge bg="info">{selectedUser.profile.academicStatus}</Badge>
                    </div>
                  </Col>
                )}
                
                <Col md={6} className="mb-3">
                  <strong>Account Created:</strong>
                  <div className="text-muted">
                    {new Date(selectedUser.createdAt).toLocaleString()}
                  </div>
                </Col>
                
                <Col md={6} className="mb-3">
                  <strong>Last Login:</strong>
                  <div className="text-muted">
                    {selectedUser.lastLogin 
                      ? new Date(selectedUser.lastLogin).toLocaleString() 
                      : 'Never logged in'}
                  </div>
                </Col>
              </Row>
            </div>
          ) : (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reset Password Modal */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <>
              <Alert variant="warning">
                <FaLock className="me-2" />
                You are about to reset password for <strong>{selectedUser.profile?.fullName || selectedUser.username}</strong>
              </Alert>
              
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={resetPasswordData.newPassword}
                    onChange={(e) => setResetPasswordData({...resetPasswordData, newPassword: e.target.value})}
                    placeholder="Enter new password"
                  />
                  <Button variant="outline-secondary" onClick={() => setResetPasswordData({
                    ...resetPasswordData,
                    newPassword: generateRandomPassword()
                  })}>
                    Generate
                  </Button>
                </InputGroup>
                {resetPasswordData.newPassword && (
                  <Form.Text className="text-muted">
                    New password: <code>{resetPasswordData.newPassword}</code>
                  </Form.Text>
                )}
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Send password via email to user"
                  checked={resetPasswordData.sendEmail}
                  onChange={(e) => setResetPasswordData({...resetPasswordData, sendEmail: e.target.checked})}
                />
                <Form.Text className="text-muted">
                  Email will be sent to: {selectedUser.email}
                </Form.Text>
              </Form.Group>
            </>
          ) : (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleResetPassword} disabled={saving || !resetPasswordData.newPassword}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Resetting...
              </>
            ) : 'Reset Password'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal show={showBulkModal} onHide={() => setShowBulkModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Bulk User Upload</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBulkUpload}>
          <Modal.Body>
            <Alert variant="info">
              <FaInfoCircle className="me-2" />
              <strong>Instructions:</strong>
              <ol className="mb-0 mt-2">
                <li>Download the CSV template</li>
                <li>Fill in user details</li>
                <li>Upload the CSV file</li>
                <li>Review and confirm upload</li>
              </ol>
            </Alert>
            
            {bulkResults ? (
              <div>
                <h5>Upload Results</h5>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Total</th>
                      <th>Successful</th>
                      <th>Failed</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{bulkResults.total}</td>
                      <td className="text-success">{bulkResults.success}</td>
                      <td className="text-danger">{bulkResults.failed}</td>
                    </tr>
                  </tbody>
                </Table>
                
                {bulkResults.errors && bulkResults.errors.length > 0 && (
                  <div className="mt-3">
                    <h6>Errors:</h6>
                    <div className="small text-danger">
                      {bulkResults.errors.slice(0, 5).map((error, index) => (
                        <div key={index} className="mb-1">
                          Row {error.row}: {error.error}
                        </div>
                      ))}
                      {bulkResults.errors.length > 5 && (
                        <div>... and {bulkResults.errors.length - 5} more errors</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Select CSV File</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".csv"
                    onChange={(e) => setBulkFile(e.target.files[0])}
                    required
                  />
                  <Form.Text className="text-muted">
                    Supported format: CSV only
                  </Form.Text>
                </Form.Group>
                
                <div className="text-center">
                  <Button variant="outline-secondary" onClick={downloadTemplate} className="me-2">
                    <FaDownload className="me-2" /> Download Template
                  </Button>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowBulkModal(false);
              setBulkFile(null);
              setBulkResults(null);
            }}>
              {bulkResults ? 'Close' : 'Cancel'}
            </Button>
            {!bulkResults && (
              <Button type="submit" variant="primary" disabled={saving || !bulkFile}>
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Uploading...
                  </>
                ) : 'Upload CSV'}
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default UserManagement;