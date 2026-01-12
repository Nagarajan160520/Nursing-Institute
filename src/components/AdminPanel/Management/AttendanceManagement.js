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
  InputGroup,
  Tab,
  Tabs,
  Alert,
  Spinner,
  Dropdown
} from 'react-bootstrap';
import {
  FaSearch,
  FaCalendarAlt,
  FaUserCheck,
  FaUserTimes,
  FaChartBar,
  FaFileExport,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaDownload,
  FaUpload,
  FaClock,
  FaCalendarCheck,
  FaCalendarDay,
  FaRegCalendarCheck
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('mark');
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    course: '',
    semester: '',
    subject: ''
  });

  // Attendance marking
  const [attendanceData, setAttendanceData] = useState({
    date: new Date().toISOString().split('T')[0],
    course: '',
    subject: '',
    semester: '',
    session: 'Morning',
    type: 'Theory',
    students: []
  });

  // Report filters
  const [reportFilters, setReportFilters] = useState({
    studentId: '',
    course: '',
    semester: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchCourses();
    fetchAttendance();
  }, [filters]);

  useEffect(() => {
    if (selectedCourse) {
      fetchStudentsByCourse();
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/admin/courses');
      if (response.data.success) {
        setCourses(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchStudentsByCourse = async () => {
    try {
      const response = await api.get('/admin/students', {
        params: { course: selectedCourse }
      });
      if (response.data.success) {
        setStudents(response.data.data.students || []);
        
        // Initialize attendance data
        const initialStudents = response.data.data.students.map(student => ({
          studentId: student._id,
          studentName: student.fullName,
          studentRoll: student.studentId,
          status: 'Present',
          hoursAttended: 4,
          remarks: ''
        }));
        
        setAttendanceData(prev => ({
          ...prev,
          students: initialStudents,
          course: selectedCourse
        }));
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.date) params.date = filters.date;
      if (filters.course) params.course = filters.course;
      if (filters.semester) params.semester = filters.semester;
      if (filters.subject) params.subject = filters.subject;

      const response = await api.get('/admin/attendance', { params });
      if (response.data.success) {
        setAttendance(response.data.data.attendance || []);
      } else {
        toast.error('Failed to fetch attendance');
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!attendanceData.course || !attendanceData.subject || !attendanceData.date) {
      toast.error('Please select course, subject, and date');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/admin/attendance', attendanceData);
      if (response.data.success) {
        toast.success('Attendance marked successfully');
        setShowMarkModal(false);
        fetchAttendance();
        
        // Reset form
        setAttendanceData({
          date: new Date().toISOString().split('T')[0],
          course: '',
          subject: '',
          semester: '',
          session: 'Morning',
          type: 'Theory',
          students: []
        });
      } else {
        toast.error(response.data.message || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      students: prev.students.map(student =>
        student.studentId === studentId
          ? { ...student, status }
          : student
      )
    }));
  };

  const handleHoursChange = (studentId, hours) => {
    setAttendanceData(prev => ({
      ...prev,
      students: prev.students.map(student =>
        student.studentId === studentId
          ? { ...student, hoursAttended: parseInt(hours) || 0 }
          : student
      )
    }));
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('bulkAttendanceFile');
    if (!fileInput.files[0]) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
      const response = await api.post('/admin/attendance/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        toast.success(`Bulk upload completed: ${response.data.data.success} records`);
        setShowBulkModal(false);
        fetchAttendance();
      } else {
        toast.error(response.data.message || 'Bulk upload failed');
      }
    } catch (error) {
      console.error('Error in bulk upload:', error);
      toast.error('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/attendance/report', {
        params: reportFilters
      });
      
      if (response.data.success) {
        const report = response.data.data;
        
        // Create and download report as CSV
        const csvContent = createCSVReport(report);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        setShowReportModal(false);
        toast.success('Report generated and downloaded');
      } else {
        toast.error('Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const createCSVReport = (reportData) => {
    const headers = ['Student ID', 'Student Name', 'Course', 'Month', 'Total Days', 'Present', 'Absent', 'Percentage'];
    const rows = reportData.students?.map(student => [
      student.studentId,
      student.fullName,
      reportData.courseName,
      reportData.month,
      reportData.totalDays,
      student.presentDays,
      student.absentDays,
      student.percentage + '%'
    ]) || [];

    const summary = [
      ['Summary', '', '', '', '', '', '', ''],
      ['Total Students', reportData.totalStudents],
      ['Average Attendance', reportData.averagePercentage + '%'],
      ['Best Student', reportData.bestStudent?.name + ' (' + reportData.bestStudent?.percentage + '%)'],
      ['Worst Student', reportData.worstStudent?.name + ' (' + reportData.worstStudent?.percentage + '%)']
    ];

    return [...headers, ...rows, ...summary]
      .map(row => Array.isArray(row) ? row.map(cell => `"${cell}"`).join(',') : `"${row}"`)
      .join('\n');
  };

  const downloadTemplate = () => {
    const template = `Date,Student ID,Course,Subject,Semester,Session,Type,Status,Hours Attended,Remarks
${new Date().toISOString().split('T')[0]},STU2024001,COURSE001,Anatomy,1,Morning,Theory,Present,4,Regular class
${new Date().toISOString().split('T')[0]},STU2024002,COURSE001,Anatomy,1,Morning,Theory,Absent,0,Medical leave`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'danger';
      case 'Late': return 'warning';
      case 'Leave': return 'info';
      case 'Medical Leave': return 'primary';
      default: return 'secondary';
    }
  };

  const calculateStats = () => {
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'Present').length;
    const absent = attendance.filter(a => a.status === 'Absent').length;
    const late = attendance.filter(a => a.status === 'Late').length;
    
    return {
      total,
      present,
      absent,
      late,
      presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0
    };
  };

  const stats = calculateStats();

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' })
  }));

  // Generate year options (last 5 years to next 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1">Attendance Management</h2>
          <p className="text-muted mb-0">Track and manage student attendance</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={() => setShowReportModal(true)}>
            <FaChartBar className="me-2" />
            Generate Report
          </Button>
          <Button variant="warning" onClick={() => setShowBulkModal(true)}>
            <FaUpload className="me-2" />
            Bulk Upload
          </Button>
          <Button variant="primary" onClick={() => setShowMarkModal(true)}>
            <FaPlus className="me-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Today's Attendance</h6>
                  <h3 className="mb-0">{stats.total}</h3>
                </div>
                <div className="text-primary">
                  <FaCalendarDay size={30} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Present</h6>
                  <h3 className="mb-0 text-success">{stats.present}</h3>
                </div>
                <div className="text-success">
                  <FaUserCheck size={30} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Absent</h6>
                  <h3 className="mb-0 text-danger">{stats.absent}</h3>
                </div>
                <div className="text-danger">
                  <FaUserTimes size={30} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Percentage</h6>
                  <h3 className="mb-0 text-info">{stats.presentPercentage}%</h3>
                </div>
                <div className="text-info">
                  <FaChartBar size={30} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onSelect={setActiveTab}
        className="mb-4"
        fill
      >
        <Tab eventKey="mark" title="Mark Attendance">
          {/* Mark Attendance Form */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="card-title mb-4">Mark Attendance</h5>
              <Row className="g-3 mb-4">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Date *</Form.Label>
                    <Form.Control
                      type="date"
                      value={attendanceData.date}
                      onChange={(e) => setAttendanceData({
                        ...attendanceData,
                        date: e.target.value
                      })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Course *</Form.Label>
                    <Form.Select
                      value={attendanceData.course}
                      onChange={(e) => {
                        setAttendanceData({...attendanceData, course: e.target.value});
                        setSelectedCourse(e.target.value);
                      }}
                      required
                    >
                      <option value="">Select Course</option>
                      {courses.map(course => (
                        <option key={course._id} value={course._id}>
                          {course.courseName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Subject *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Subject name"
                      value={attendanceData.subject}
                      onChange={(e) => setAttendanceData({
                        ...attendanceData,
                        subject: e.target.value
                      })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Semester</Form.Label>
                    <Form.Select
                      value={attendanceData.semester}
                      onChange={(e) => setAttendanceData({
                        ...attendanceData,
                        semester: e.target.value
                      })}
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Session</Form.Label>
                    <Form.Select
                      value={attendanceData.session}
                      onChange={(e) => setAttendanceData({
                        ...attendanceData,
                        session: e.target.value
                      })}
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Full Day">Full Day</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      value={attendanceData.type}
                      onChange={(e) => setAttendanceData({
                        ...attendanceData,
                        type: e.target.value
                      })}
                    >
                      <option value="Theory">Theory</option>
                      <option value="Practical">Practical</option>
                      <option value="Clinical">Clinical</option>
                      <option value="Tutorial">Tutorial</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Students List */}
              {students.length > 0 ? (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Hours Attended</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr key={student._id}>
                          <td>{index + 1}</td>
                          <td>{student.studentId}</td>
                          <td>{student.fullName}</td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle
                                variant={getStatusColor(
                                  attendanceData.students.find(s => s.studentId === student._id)?.status || 'Present'
                                )}
                                size="sm"
                              >
                                {attendanceData.students.find(s => s.studentId === student._id)?.status || 'Present'}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {['Present', 'Absent', 'Late', 'Leave', 'Medical Leave'].map(status => (
                                  <Dropdown.Item
                                    key={status}
                                    onClick={() => handleStudentStatusChange(student._id, status)}
                                  >
                                    {status}
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              min="0"
                              max="8"
                              size="sm"
                              style={{ width: '80px' }}
                              value={
                                attendanceData.students.find(s => s.studentId === student._id)?.hoursAttended || 4
                              }
                              onChange={(e) => handleHoursChange(student._id, e.target.value)}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              size="sm"
                              placeholder="Remarks"
                              value={
                                attendanceData.students.find(s => s.studentId === student._id)?.remarks || ''
                              }
                              onChange={(e) => {
                                const newStudents = attendanceData.students.map(s =>
                                  s.studentId === student._id
                                    ? { ...s, remarks: e.target.value }
                                    : s
                                );
                                setAttendanceData({...attendanceData, students: newStudents});
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="mt-4">
                    <Button
                      variant="primary"
                      onClick={handleMarkAttendance}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Attendance'}
                    </Button>
                  </div>
                </div>
              ) : (
                <Alert variant="info">
                  Select a course to load students
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="view" title="View Attendance">
          {/* Filters */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <Row className="g-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={filters.date}
                      onChange={(e) => setFilters({...filters, date: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
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
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Semester</Form.Label>
                    <Form.Select
                      value={filters.semester}
                      onChange={(e) => setFilters({...filters, semester: e.target.value})}
                    >
                      <option value="">All</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>Sem {sem}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Subject name"
                      value={filters.subject}
                      onChange={(e) => setFilters({...filters, subject: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <div className="d-flex justify-content-end">
                    <Button variant="outline-secondary" onClick={fetchAttendance}>
                      <FaFilter className="me-2" />
                      Apply Filters
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Attendance Table */}
          <Card className="border-0 shadow-sm">
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading attendance data...</p>
                </div>
              ) : attendance.length > 0 ? (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Subject</th>
                        <th>Session</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Hours</th>
                        <th>Remarks</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((record, index) => (
                        <tr key={record._id}>
                          <td>{index + 1}</td>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>
                            <div>
                              <div>{record.student?.fullName || 'N/A'}</div>
                              <small className="text-muted">{record.student?.studentId || 'N/A'}</small>
                            </div>
                          </td>
                          <td>{record.course?.courseName || 'N/A'}</td>
                          <td>{record.subject}</td>
                          <td>{record.session}</td>
                          <td>
                            <Badge bg="info">{record.type}</Badge>
                          </td>
                          <td>
                            <Badge bg={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                          </td>
                          <td>{record.hoursAttended}/{record.totalHours}</td>
                          <td>
                            <small className="text-muted">{record.remarks || '-'}</small>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button variant="outline-warning" size="sm">
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => {
                                  if (window.confirm('Delete this attendance record?')) {
                                    // Handle delete
                                  }
                                }}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">No attendance records found</p>
                  <Button variant="primary" onClick={() => setShowMarkModal(true)}>
                    <FaPlus className="me-2" />
                    Mark First Attendance
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Bulk Upload Modal */}
      <Modal show={showBulkModal} onHide={() => setShowBulkModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Bulk Upload Attendance</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBulkUpload}>
          <Modal.Body>
            <Alert variant="info" className="mb-3">
              <strong>Instructions:</strong>
              <ol className="mb-0 mt-2">
                <li>Download the CSV template</li>
                <li>Fill in attendance data</li>
                <li>Upload the completed file</li>
                <li>Required columns: Date, Student ID, Course, Subject, Semester, Session, Type, Status, Hours Attended, Remarks</li>
              </ol>
            </Alert>
            <Form.Group className="mb-3">
              <Form.Label>Select CSV File *</Form.Label>
              <Form.Control
                type="file"
                id="bulkAttendanceFile"
                accept=".csv,.xlsx,.xls"
                required
              />
              <Form.Text className="text-muted">
                Supported formats: CSV, Excel (.xlsx, .xls)
              </Form.Text>
            </Form.Group>
            <div className="text-center">
              <Button variant="outline-secondary" onClick={downloadTemplate}>
                <FaDownload className="me-2" /> Download Template
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBulkModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="warning" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload & Process'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Report Modal */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Generate Attendance Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Course</Form.Label>
                <Form.Select
                  value={reportFilters.course}
                  onChange={(e) => setReportFilters({...reportFilters, course: e.target.value})}
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
            <Col md={6}>
              <Form.Group>
                <Form.Label>Semester</Form.Label>
                <Form.Select
                  value={reportFilters.semester}
                  onChange={(e) => setReportFilters({...reportFilters, semester: e.target.value})}
                >
                  <option value="">All</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Month</Form.Label>
                <Form.Select
                  value={reportFilters.month}
                  onChange={(e) => setReportFilters({...reportFilters, month: e.target.value})}
                >
                  {monthOptions.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Select
                  value={reportFilters.year}
                  onChange={(e) => setReportFilters({...reportFilters, year: e.target.value})}
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Student ID (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter specific student ID"
                  value={reportFilters.studentId}
                  onChange={(e) => setReportFilters({...reportFilters, studentId: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Alert variant="info" className="mt-3">
                <strong>Report will include:</strong>
                <ul className="mb-0 mt-2">
                  <li>Monthly attendance summary</li>
                  <li>Percentage calculations</li>
                  <li>Student-wise breakdown</li>
                  <li>Course-wise analysis</li>
                  <li>Downloadable CSV format</li>
                </ul>
              </Alert>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={generateReport} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Mark Attendance Modal (Alternative View) */}
      <Modal show={showMarkModal} onHide={() => setShowMarkModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Mark Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3 mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Date *</Form.Label>
                <Form.Control
                  type="date"
                  value={attendanceData.date}
                  onChange={(e) => setAttendanceData({
                    ...attendanceData,
                    date: e.target.value
                  })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Course *</Form.Label>
                <Form.Select
                  value={attendanceData.course}
                  onChange={(e) => {
                    setAttendanceData({...attendanceData, course: e.target.value});
                    setSelectedCourse(e.target.value);
                  }}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.courseName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Subject *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Subject name"
                  value={attendanceData.subject}
                  onChange={(e) => setAttendanceData({
                    ...attendanceData,
                    subject: e.target.value
                  })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {students.length > 0 ? (
            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <Table hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Hours</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student._id}>
                      <td>{index + 1}</td>
                      <td>{student.studentId}</td>
                      <td>{student.fullName}</td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={attendanceData.students.find(s => s.studentId === student._id)?.status || 'Present'}
                          onChange={(e) => handleStudentStatusChange(student._id, e.target.value)}
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Late">Late</option>
                          <option value="Leave">Leave</option>
                          <option value="Medical Leave">Medical Leave</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          min="0"
                          max="8"
                          size="sm"
                          style={{ width: '70px' }}
                          value={
                            attendanceData.students.find(s => s.studentId === student._id)?.hoursAttended || 4
                          }
                          onChange={(e) => handleHoursChange(student._id, e.target.value)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          size="sm"
                          placeholder="Remarks"
                          value={
                            attendanceData.students.find(s => s.studentId === student._id)?.remarks || ''
                          }
                          onChange={(e) => {
                            const newStudents = attendanceData.students.map(s =>
                              s.studentId === student._id
                                ? { ...s, remarks: e.target.value }
                                : s
                            );
                            setAttendanceData({...attendanceData, students: newStudents});
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <Alert variant="info" className="text-center">
              Select a course to load students
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMarkModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleMarkAttendance}
            disabled={loading || !attendanceData.course || !attendanceData.subject}
          >
            {loading ? 'Saving...' : 'Save Attendance'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AttendanceManagement;