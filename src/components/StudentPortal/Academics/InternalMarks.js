import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Alert, ProgressBar } from 'react-bootstrap';
import { FaChartLine, FaFileExport, FaFilter, FaAward, FaExclamationTriangle } from 'react-icons/fa';
import api from '../../../services/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import toast from 'react-hot-toast';
import useAutoRefresh from '../../../hooks/useAutoRefresh';
import { io } from 'socket.io-client';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InternalMarks = () => {
  const [marksData, setMarksData] = useState([]);
  const [semesterStats, setSemesterStats] = useState({});
  const [filters, setFilters] = useState({
    semester: '',
    subject: '',
    examType: ''
  });
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarksData();
  }, [filters]);

  const fetchMarksData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.examType) params.append('examType', filters.examType);

      const response = await api.get(`/student/marks?${params.toString()}`);

      const data = response.data.data;
      setMarksData(data.marks || []);
      setSemesterStats(data.semesterStats || {});

      // Extract unique subjects and semesters
      const uniqueSubjects = [...new Set(data.marks.map(m => m.subject))];
      const uniqueSemesters = [...new Set(data.marks.map(m => m.semester))].sort();

      setSubjects(uniqueSubjects);
      setSemesters(uniqueSemesters);

    } catch (error) {
      toast.error('Failed to fetch marks data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh marks every 5 minutes and refetch when tab becomes visible
  useAutoRefresh(fetchMarksData, 300000);

  // Socket.IO for real-time updates
  useEffect(() => {
    const apiBase = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
    const token = localStorage.getItem('token');
    const socket = io(apiBase, { auth: { token }, transports: ['websocket'] });

    socket.on('connect', () => {
      console.log('InternalMarks socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('InternalMarks socket disconnected');
    });

    socket.on('marks-added', (data) => {
      console.log('New marks added:', data);
      toast.info('New marks have been published!');
      fetchMarksData();
    });

    socket.on('marks-published', (data) => {
      console.log('Marks published:', data);
      toast.info('Marks have been published!');
      fetchMarksData();
    });

    socket.on('marks-updated', (data) => {
      console.log('Marks updated:', data);
      toast.info('Marks have been updated!');
      fetchMarksData();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      'O': 'success',
      'A+': 'success',
      'A': 'info',
      'B+': 'info',
      'B': 'warning',
      'C': 'warning',
      'D': 'danger',
      'F': 'danger'
    };
    return gradeColors[grade] || 'secondary';
  };

  const getResultStatusBadge = (status) => {
    const statusConfig = {
      'Pass': { variant: 'success', text: 'Passed' },
      'Fail': { variant: 'danger', text: 'Failed' },
      'Supplementary': { variant: 'warning', text: 'Supplementary' },
      'Absent': { variant: 'secondary', text: 'Absent' },
      'Pending': { variant: 'info', text: 'Pending' }
    };

    const config = statusConfig[status] || { variant: 'secondary', text: status };
    
    return (
      <Badge bg={config.variant}>
        {config.text}
      </Badge>
    );
  };

  const calculatePercentage = (obtained, max) => {
    if (!max || max === 0) return 0;
    return Math.round((obtained / max) * 100);
  };

  const exportMarksReport = async () => {
    try {
      toast.loading('Preparing marks download...', { id: 'download-marks' });

      const params = new URLSearchParams();
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.examType) params.append('examType', filters.examType);

      const response = await api.get(`/student/marks/download?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'text/csv' });

      // Create a link element and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from response headers or create default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'marks_report.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Marks report downloaded successfully!', { id: 'download-marks' });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download marks report', { id: 'download-marks' });
    }
  };

  // Prepare chart data for semester-wise performance
  const chartData = {
    labels: semesters.map(sem => `Semester ${sem}`),
    datasets: [
      {
        label: 'Average Percentage',
        data: semesters.map(sem => {
          const stats = semesterStats[sem];
          return stats ? stats.percentage : 0;
        }),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
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
        text: 'Semester-wise Performance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Percentage (%)'
        }
      }
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-2">Internal Marks</h2>
          <p className="text-muted mb-0">
            View your internal assessment marks and performance
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={exportMarksReport}
        >
          <FaFileExport className="me-2" />
          Export Report
        </button>
      </div>

      {/* Overall Performance */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="card-title mb-4">
                <FaChartLine className="me-2" />
                Performance Overview
              </h5>
              <Bar data={chartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="card-title mb-4">
                <FaFilter className="me-2" />
                Filter Marks
              </h5>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Semester</Form.Label>
                  <Form.Select
                    name="semester"
                    value={filters.semester}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Semesters</option>
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
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

                <Form.Group className="mb-3">
                  <Form.Label>Exam Type</Form.Label>
                  <Form.Select
                    name="examType"
                    value={filters.examType}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Types</option>
                    <option value="Internal">Internal</option>
                    <option value="External">External</option>
                    <option value="Practical">Practical</option>
                    <option value="Assignment">Assignment</option>
                  </Form.Select>
                </Form.Group>

                <button 
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={fetchMarksData}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Apply Filters'}
                </button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Marks Table */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">Detailed Marks Records</h5>
                <small className="text-muted">
                  Showing {marksData.length} records
                </small>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading marks data...</p>
                </div>
              ) : marksData.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Semester</th>
                        <th>Exam Type</th>
                        <th>Exam Date</th>
                        <th>Theory</th>
                        <th>Practical</th>
                        <th>Total</th>
                        <th>Percentage</th>
                        <th>Grade</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marksData.map((mark, index) => {
                        const totalObtained = mark.totalMarks?.obtained || 0;
                        const totalMax = mark.totalMarks?.max || 100;
                        const percentage = calculatePercentage(totalObtained, totalMax);
                        
                        return (
                          <tr key={index}>
                            <td>
                              <strong>{mark.subject}</strong>
                            </td>
                            <td>
                              <Badge bg="info">Sem {mark.semester}</Badge>
                            </td>
                            <td>
                              <Badge bg="secondary">{mark.examType}</Badge>
                            </td>
                            <td>
                              {new Date(mark.examDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td>
                              {mark.marks?.theory?.obtained || 0}/{mark.marks?.theory?.max || 0}
                            </td>
                            <td>
                              {mark.marks?.practical?.obtained || 0}/{mark.marks?.practical?.max || 0}
                            </td>
                            <td>
                              <strong>{totalObtained}/{totalMax}</strong>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="me-2" style={{ width: '60px' }}>
                                  <ProgressBar 
                                    now={percentage} 
                                    variant={percentage >= 40 ? 'success' : 'danger'}
                                    label={`${percentage}%`}
                                  />
                                </div>
                                <span className={percentage >= 40 ? 'text-success' : 'text-danger'}>
                                  {percentage}%
                                </span>
                              </div>
                            </td>
                            <td>
                              <Badge bg={getGradeColor(mark.grade)}>
                                {mark.grade}
                              </Badge>
                            </td>
                            <td>
                              {getResultStatusBadge(mark.resultStatus)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <Alert variant="info" className="text-center py-4">
                  <h5 className="alert-heading">No Marks Records Found</h5>
                  <p className="mb-0">
                    No marks records available for the selected filters.
                  </p>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Grading System and Statistics */}
      <Row className="mt-4">
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">
                <FaAward className="me-2" />
                Grading System
              </h5>
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Grade Points</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-success">
                    <td>90% and above</td>
                    <td><Badge bg="success">O</Badge></td>
                    <td>10</td>
                    <td>Outstanding</td>
                  </tr>
                  <tr className="table-info">
                    <td>80% - 89%</td>
                    <td><Badge bg="info">A+</Badge></td>
                    <td>9</td>
                    <td>Excellent</td>
                  </tr>
                  <tr className="table-info">
                    <td>70% - 79%</td>
                    <td><Badge bg="info">A</Badge></td>
                    <td>8</td>
                    <td>Very Good</td>
                  </tr>
                  <tr className="table-warning">
                    <td>60% - 69%</td>
                    <td><Badge bg="warning">B+</Badge></td>
                    <td>7</td>
                    <td>Good</td>
                  </tr>
                  <tr className="table-warning">
                    <td>50% - 59%</td>
                    <td><Badge bg="warning">B</Badge></td>
                    <td>6</td>
                    <td>Above Average</td>
                  </tr>
                  <tr className="table-danger">
                    <td>40% - 49%</td>
                    <td><Badge bg="danger">C</Badge></td>
                    <td>5</td>
                    <td>Average</td>
                  </tr>
                  <tr className="table-danger">
                    <td>35% - 39%</td>
                    <td><Badge bg="danger">D</Badge></td>
                    <td>4</td>
                    <td>Pass</td>
                  </tr>
                  <tr className="table-secondary">
                    <td>Below 35%</td>
                    <td><Badge bg="secondary">F</Badge></td>
                    <td>0</td>
                    <td>Fail</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">
                <FaExclamationTriangle className="me-2" />
                Performance Summary
              </h5>
              
              {Object.keys(semesterStats).length > 0 ? (
                <div>
                  {Object.entries(semesterStats).map(([semester, stats]) => (
                    <div key={semester} className="mb-4">
                      <h6 className="mb-3">Semester {semester} Performance</h6>
                      <div className="row">
                        <div className="col-6">
                          <div className="mb-3">
                            <small className="text-muted d-block">Average Percentage</small>
                            <h4 className={`mb-0 ${stats.percentage >= 40 ? 'text-success' : 'text-danger'}`}>
                              {stats.percentage ? stats.percentage.toFixed(2) : 0}%
                            </h4>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="mb-3">
                            <small className="text-muted d-block">Pass Percentage</small>
                            <h4 className="mb-0 text-success">
                              {stats.passPercentage ? stats.passPercentage.toFixed(2) : 0}%
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <small className="text-muted d-block">Subjects Passed</small>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <span className="h4 mb-0 text-success">
                              {stats.passedSubjects || 0}
                            </span>
                            <span className="text-muted">/{stats.totalSubjects || 0}</span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <ProgressBar 
                              now={stats.passPercentage || 0} 
                              variant="success"
                              style={{ height: '8px' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert variant="info">
                  No semester statistics available. Marks will appear here after evaluation.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InternalMarks;