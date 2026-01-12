import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaCalendarCheck,
  FaChartBar,
  FaCalendarWeek,
  FaFileDownload,
  FaBell,
  FaUserCircle,
  FaBookMedical,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';
import api from '../../../services/api';
import useAutoRefresh from '../../../hooks/useAutoRefresh';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial dashboard data on mount
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const [profileRes, attendanceRes, marksRes, notificationsRes] = await Promise.all([
        api.get('/student/dashboard'),
        api.get('/student/attendance?limit=5'),
        api.get('/student/marks?limit=5'),
        api.get('/student/notifications?limit=5')
      ]);

      setStudentData(profileRes.data.data);
      setAttendance(attendanceRes.data.data?.attendance || []);
      setMarks(marksRes.data.data?.marks || []);
      setNotifications(notificationsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh the dashboard every 5 minutes and refetch when tab becomes visible
  useAutoRefresh(fetchStudentData, 300000);

  const attendanceChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Attendance %',
        data: [85, 88, 90, 87, 92, 95],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Attendance Trend',
      },
    },
  };

  const quickLinks = [
    { 
      icon: <FaFileDownload />, 
      text: 'Download Study Materials', 
      link: '/student/downloads',
      variant: 'primary'
    },
    { 
      icon: <FaCalendarCheck />, 
      text: 'View Attendance', 
      link: '/student/attendance',
      variant: 'success'
    },
    {
      icon: <FaChartBar />,
      text: 'Check Internal Marks',
      link: '/student/marks',
      variant: 'warning'
    },
    {
      icon: <FaCalendarWeek />,
      text: 'View Timetable',
      link: '/student/timetable',
      variant: 'secondary'
    },
    {
      icon: <FaBookMedical />,
      text: 'Clinical Schedule',
      link: '/student/clinical-schedule',
      variant: 'info'
    }
  ];

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={9}>
                  <h3 className="mb-2">
                    Welcome back, {studentData?.student?.fullName || 'Student'}!
                  </h3>
                  <p className="mb-0">
                    <strong>Course:</strong> {studentData?.student?.courseEnrolled?.courseName || 'N/A'} • 
                    <strong> Semester:</strong> {studentData?.student?.semester || 'N/A'} • 
                    <strong> Student ID:</strong> {studentData?.student?.studentId || 'N/A'}
                  </p>
                </Col>
                <Col md={3} className="text-end">
                  <FaUserCircle size={80} className="opacity-50" />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="g-4 mb-4">
        <Col xs={12} md={6} lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Overall Attendance</h6>
                  <h3 className="mb-0">{studentData?.stats?.overallAttendance || 0}%</h3>
                </div>
                <div className="text-success">
                  <FaCalendarCheck size={30} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Internal Marks</h6>
                  <h3 className="mb-0">{studentData?.stats?.internalMarks ? studentData.stats.internalMarks + '%' : '—'}</h3>
                </div>
                <div className="text-warning">
                  <FaChartBar size={30} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Pending Assignments</h6>
                  <h3 className="mb-0">{studentData?.stats?.pendingAssignments || 0}</h3>
                </div>
                <div className="text-danger">
                  <FaFileDownload size={30} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">New Notifications</h6>
                  <h3 className="mb-0">{notifications.length}</h3>
                </div>
                <div className="text-info">
                  <FaBell size={30} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="g-4">
        {/* Attendance Chart */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Line data={attendanceChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Links */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Quick Links</h5>
              <div className="d-grid gap-3">
                {quickLinks.map((link, index) => (
                  <Button
                    key={index}
                    as={Link}
                    to={link.link}
                    variant={link.variant}
                    className="d-flex align-items-center justify-content-start py-3"
                  >
                    <span className="me-3">{link.icon}</span>
                    <span>{link.text}</span>
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row className="g-4 mt-4">
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">Recent Attendance</h5>
                <Link to="/student/attendance" className="small">View All</Link>
              </div>
              {attendance.length > 0 ? (
                <ListGroup variant="flush">
                  {attendance.map((record, index) => (
                    <ListGroup.Item key={index} className="border-0 border-bottom py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{record.subject}</h6>
                          <small className="text-muted">
                            {new Date(record.date).toLocaleDateString()} • {record.type}
                          </small>
                        </div>
                        <Badge bg={record.status === 'Present' ? 'success' : 'danger'}>
                          {record.status}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted text-center py-4">No attendance records</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">Recent Marks</h5>
                <Link to="/student/marks" className="small">View All</Link>
              </div>
              {marks.length > 0 ? (
                <ListGroup variant="flush">
                  {marks.map((mark, index) => (
                    <ListGroup.Item key={index} className="border-0 border-bottom py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{mark.subject}</h6>
                          <small className="text-muted">
                            {mark.examType} • {new Date(mark.examDate).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="text-end">
                          <h5 className="mb-0">{mark.marks?.obtained || 0}/{mark.marks?.max || 100}</h5>
                          <Badge bg={mark.grade === 'F' ? 'danger' : 'success'}>
                            Grade: {mark.grade}
                          </Badge>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted text-center py-4">No marks available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Notifications */}
      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">Recent Notifications</h5>
                <Link to="/student/notifications" className="small">View All</Link>
              </div>
              {notifications.length > 0 ? (
                <ListGroup variant="flush">
                  {notifications.map((notification, index) => (
                    <ListGroup.Item key={index} className="border-0 border-bottom py-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{notification.title}</h6>
                          <p className="text-muted mb-1 small">{notification.message}</p>
                          <small className="text-muted">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        {notification.priority === 'high' && (
                          <Badge bg="danger">Important</Badge>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted text-center py-4">No notifications</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard;