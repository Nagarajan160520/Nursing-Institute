import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Table, Button, Badge, Alert } from 'react-bootstrap';
import { FaCalendarAlt, FaChartBar, FaDownload, FaFilter } from 'react-icons/fa';
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

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    leave: 0,
    percentage: 0
  });
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    subject: ''
  });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load subjects and initial attendance data on mount
    fetchSubjects();
    fetchAttendance();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/student/attendance');
      const attendanceList = response?.data?.data?.attendance || [];
      const uniqueSubjects = [...new Set(attendanceList.map(a => a.subject).filter(Boolean))];
      setSubjects(uniqueSubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/student/attendance?month=${filters.month}&year=${filters.year}&subject=${filters.subject}`);
      const attendanceList = response?.data?.data?.attendance || [];
      const statsData = response?.data?.data?.stats || {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        leave: 0,
        percentage: 0
      };

      setAttendanceData(attendanceList);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to fetch attendance data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh attendance every 5 minutes and refetch when tab becomes visible
  useAutoRefresh(fetchAttendance, 300000);

  // Listen for real-time updates and refetch when relevant
  useEffect(() => {
    const handler = () => {
      fetchAttendance();
    };

    window.addEventListener('realtime:attendance', handler);
    window.addEventListener('realtime:marks', handler); // marks might affect stats

    return () => {
      window.removeEventListener('realtime:attendance', handler);
      window.removeEventListener('realtime:marks', handler);
    };
  }, [filters]);

  const attendanceChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Attendance %',
        data: [85, 88, 90, 87],
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
        text: 'Monthly Attendance Trend',
      },
    },
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Present': { variant: 'success', icon: '✓' },
      'Absent': { variant: 'danger', icon: '✗' },
      'Late': { variant: 'warning', icon: '⏰' },
      'Leave': { variant: 'info', icon: '📝' },
      'Medical Leave': { variant: 'primary', icon: '🏥' }
    };

    const config = statusConfig[status] || { variant: 'secondary', icon: '?' };
    
    return (
      <Badge bg={config.variant} className="d-flex align-items-center gap-1">
        <span>{config.icon}</span>
        <span>{status}</span>
      </Badge>
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const downloadAttendanceReport = () => {
    toast.success('Attendance report download initiated');
    // In real implementation, this would generate and download a PDF
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-2">Attendance Records</h2>
          <p className="text-muted mb-0">
            View and track your attendance across all subjects
          </p>
        </div>
        <Button variant="primary" onClick={downloadAttendanceReport}>
          <FaDownload className="me-2" />
          Download Report
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col xs={12} md={6} lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: '50px', height: '50px' }}>
                  <FaChartBar size={20} />
                </div>
              </div>
              <h3 className="mb-1">{stats.percentage}%</h3>
              <p className="text-muted mb-0">Overall Attendance</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={6} lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h6 className="text-muted mb-2">Total Sessions</h6>
              <h3 className="mb-0">{stats.total}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h6 className="text-muted mb-2">Present</h6>
              <h3 className="mb-0 text-success">{stats.present}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h6 className="text-muted mb-2">Absent</h6>
              <h3 className="mb-0 text-danger">{stats.absent}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters and Chart */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Line data={attendanceChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">
                <FaFilter className="me-2" />
                Filter Attendance
              </h5>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Month</Form.Label>
                  <Form.Select
                    name="month"
                    value={filters.month}
                    onChange={handleFilterChange}
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <Form.Select
                    name="year"
                    value={filters.year}
                    onChange={handleFilterChange}
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Subject (Optional)</Form.Label>
                  <Form.Select
                    name="subject"
                    value={filters.subject}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((subject, index) => (
                      <option key={index} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Button 
                  variant="primary" 
                  onClick={fetchAttendance}
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? 'Loading...' : 'Apply Filters'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Attendance Table */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">
                  <FaCalendarAlt className="me-2" />
                  Detailed Attendance Records
                </h5>
                <small className="text-muted">
                  Showing {attendanceData.length} records
                </small>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading attendance records...</p>
                </div>
              ) : attendanceData.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Subject</th>
                        <th>Session</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Hours</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((record, index) => (
                        <tr key={index}>
                          <td>
                            {new Date(record.date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td>
                            <strong>{record.subject}</strong>
                          </td>
                          <td>{record.session}</td>
                          <td>
                            <Badge bg="secondary">{record.type}</Badge>
                          </td>
                          <td>
                            {getStatusBadge(record.status)}
                          </td>
                          <td>
                            {record.hoursAttended || 0}/{record.totalHours || 8}
                          </td>
                          <td>
                            <small className="text-muted">
                              {record.remarks || 'No remarks'}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <Alert variant="info" className="text-center py-4">
                  <h5 className="alert-heading">No Attendance Records Found</h5>
                  <p className="mb-0">
                    No attendance records available for the selected filters.
                    Try changing the month, year, or subject.
                  </p>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Attendance Guidelines */}
      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-3">Attendance Guidelines</h5>
              <Row>
                <Col md={4}>
                  <div className="mb-3">
                    <h6 className="text-success">
                      <Badge bg="success" className="me-2">✓</Badge>
                      Minimum Requirement
                    </h6>
                    <p className="text-muted small mb-0">
                      Minimum 75% attendance is required to appear for exams
                    </p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <h6 className="text-warning">
                      <Badge bg="warning" className="me-2">⚠️</Badge>
                      Warning Zone
                    </h6>
                    <p className="text-muted small mb-0">
                      Below 75%: Warning will be issued to parents
                    </p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <h6 className="text-danger">
                      <Badge bg="danger" className="me-2">✗</Badge>
                      Disqualification
                    </h6>
                    <p className="text-muted small mb-0">
                      Below 60%: Not eligible to appear for semester exams
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Attendance;