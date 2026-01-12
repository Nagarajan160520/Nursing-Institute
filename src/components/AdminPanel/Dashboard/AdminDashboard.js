import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaGraduationCap, 
  FaImages, 
  FaNewspaper,
  FaChartLine,
  FaUserPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaCalendarCheck,
  FaFileDownload,
  FaBell,
  FaExclamationTriangle
} from 'react-icons/fa';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import api from '../../../services/api';
import toast from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      totalFaculty: 0,
      totalCourses: 0,
      totalGallery: 0,
      totalNews: 0,
      totalDownloads: 0
    },
    recentStudents: [],
    recentNews: [],
    admissionTrend: [],
    courseDistribution: [],
    alerts: []
  });
  
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard statistics
      const statsResponse = await api.get('/admin/dashboard/stats');
      
      // Fetch recent students
      const studentsResponse = await api.get('/admin/students?limit=5');
      
      // Fetch recent news
      const newsResponse = await api.get('/admin/news?limit=5&status=published');
      
      const data = statsResponse.data.data;
      
      setDashboardData({
        stats: data.stats || {
          totalStudents: 0,
          totalFaculty: 0,
          totalCourses: 0,
          totalGallery: 0,
          totalNews: 0,
          totalDownloads: 0
        },
        recentStudents: studentsResponse.data.data?.students?.slice(0, 5) || [],
        recentNews: newsResponse.data.data?.news?.slice(0, 5) || [],
        admissionTrend: data.admissionTrend || [],
        courseDistribution: data.courseDistribution || [],
        alerts: []
      });

      // Prepare chart data
      prepareChartData(data);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      // Fallback to mock data if API fails
      setDashboardData({
        stats: {
          totalStudents: 0,
          totalFaculty: 0,
          totalCourses: 0,
          totalGallery: 0,
          totalNews: 0,
          totalDownloads: 0
        },
        recentStudents: [],
        recentNews: [],
        admissionTrend: [],
        courseDistribution: [],
        alerts: []
      });
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (data) => {
    // Admission Trend Chart
    const admissionLabels = data.admissionTrend?.map(item => 
      `${item._id?.month || 'Jan'}/${item._id?.year || '2024'}`
    ) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    const admissionData = data.admissionTrend?.map(item => item.count) || [12, 19, 15, 25, 22, 30];

    // Course Distribution Chart
    const courseLabels = data.courseDistribution?.map(item => 
      item.courseName || 'Course'
    ) || ['GNM', 'ANM', 'B.Sc', 'M.Sc', 'PB B.Sc'];
    
    const courseData = data.courseDistribution?.map(item => item.count) || [45, 30, 25, 15, 10];

    setChartData({
      admission: {
        labels: admissionLabels,
        datasets: [
          {
            label: 'New Admissions',
            data: admissionData,
            backgroundColor: 'rgba(52, 152, 219, 0.7)',
            borderColor: 'rgba(52, 152, 219, 1)',
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
          }
        ]
      },
      courses: {
        labels: courseLabels,
        datasets: [
          {
            label: 'Students Enrolled',
            data: courseData,
            backgroundColor: [
              'rgba(46, 204, 113, 0.7)',
              'rgba(52, 152, 219, 0.7)',
              'rgba(155, 89, 182, 0.7)',
              'rgba(241, 196, 15, 0.7)',
              'rgba(230, 126, 34, 0.7)'
            ],
            borderColor: [
              'rgba(46, 204, 113, 1)',
              'rgba(52, 152, 219, 1)',
              'rgba(155, 89, 182, 1)',
              'rgba(241, 196, 15, 1)',
              'rgba(230, 126, 34, 1)'
            ],
            borderWidth: 2
          }
        ]
      }
    });
  };

  const statCards = [
    {
      title: 'Total Students',
      value: dashboardData.stats.totalStudents,
      icon: <FaUsers size={30} />,
      color: 'primary',
      link: '/admin/students',
      bg: 'bg-primary',
      text: 'text-white'
    },
    {
      title: 'Courses',
      value: dashboardData.stats.totalCourses,
      icon: <FaGraduationCap size={30} />,
      color: 'success',
      link: '/admin/courses',
      bg: 'bg-success',
      text: 'text-white'
    },
   // {
     // title: 'Faculty',
      //value: dashboardData.stats.totalFaculty,
      //icon: <FaUsers size={30} />,
      //color: 'info',
      //link: '/admin/faculty',
      //bg: 'bg-info',
      //text: 'text-white'
    //},
    {
      title: 'Gallery Items',
      value: dashboardData.stats.totalGallery,
      icon: <FaImages size={30} />,
      color: 'warning',
      link: '/admin/gallery',
      bg: 'bg-warning',
      text: 'text-dark'
    },
    {
      title: 'News & Events',
      value: dashboardData.stats.totalNews,
      icon: <FaNewspaper size={30} />,
      color: 'secondary',
      link: '/admin/news',
      bg: 'bg-secondary',
      text: 'text-white'
    },
    {
      title: 'Downloads',
      value: dashboardData.stats.totalDownloads,
      icon: <FaFileDownload size={30} />,
      color: 'danger',
      link: '/admin/downloads',
      bg: 'bg-danger',
      text: 'text-white'
    }
  ];

  const quickActions = [
    { 
      label: 'Add New Student', 
      link: '/admin/students/add', 
      icon: <FaUserPlus className="me-2" />,
      variant: 'primary' 
    },
    { 
      label: 'Upload Gallery', 
      link: '/admin/gallery/upload', 
      icon: <FaImages className="me-2" />,
      variant: 'success' 
    },
    { 
      label: 'Publish News', 
      link: '/admin/news/add', 
      icon: <FaNewspaper className="me-2" />,
      variant: 'warning' 
    },
    { 
      label: 'Add Course', 
      link: '/admin/courses/add', 
      icon: <FaGraduationCap className="me-2" />,
      variant: 'info' 
    }
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5
        }
      }
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard data...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Welcome Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center">
            <div>
              <h2 className="h3 mb-2">Admin Dashboard</h2>
              <p className="text-muted mb-0">
                Welcome back! Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button 
            variant="outline-primary" 
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <FaChartLine className="me-2" />
            Refresh Data
          </Button>
          <Button as={Link} to="/admin/students" variant="primary">
            <FaUserPlus className="me-2" />
            Manage Students
          </Button>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        {statCards.map((stat, index) => (
          <Col key={index} xs={12} md={6} lg={4} xl={2}>
            <Link to={stat.link} className="text-decoration-none">
              <Card className={`border-0 shadow-sm ${stat.bg} ${stat.text}`}>
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 opacity-75">{stat.title}</h6>
                      <h3 className="mb-0 fw-bold">{stat.value}</h3>
                    </div>
                    <div className="opacity-75">
                      {stat.icon}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Charts and Quick Actions */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Row className="g-4">
            {/* Admission Trend Chart */}
            <Col md={12}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">Monthly Admissions Trend</h5>
                    <Badge bg="primary">
                      Last 6 Months
                    </Badge>
                  </div>
                  <div style={{ height: '300px' }}>
                    {chartData.admission ? (
                      <Bar 
                        data={chartData.admission} 
                        options={chartOptions}
                      />
                    ) : (
                      <div className="text-center py-5">
                        <FaChartLine size={48} className="text-primary mb-3 opacity-50" />
                        <p className="text-muted">No admission data available</p>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Course Distribution and Quick Actions */}
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="card-title mb-4">Course Distribution</h5>
                  <div style={{ height: '200px' }}>
                    {chartData.courses ? (
                      <Bar 
                        data={chartData.courses} 
                        options={{
                          ...chartOptions,
                          plugins: {
                            legend: {
                              display: false
                            }
                          }
                        }}
                      />
                    ) : (
                      <div className="text-center py-4">
                        <FaGraduationCap size={40} className="text-warning mb-3 opacity-50" />
                        <p className="text-muted small">Course data loading...</p>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="card-title mb-4">Quick Actions</h5>
                  <div className="d-grid gap-2">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        as={Link}
                        to={action.link}
                        variant={action.variant}
                        className="d-flex align-items-center justify-content-start"
                      >
                        {action.icon}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Recent News Sidebar */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Recent News & Events</h5>
                <Link to="/admin/news" className="small text-decoration-none">
                  View All →
                </Link>
              </div>
              
              {dashboardData.recentNews.length > 0 ? (
                dashboardData.recentNews.map((news, index) => (
                  <div key={index} className="border-start border-3 border-primary ps-3 mb-3 pb-3">
                    <h6 className="mb-1 text-truncate" title={news.title}>
                      {news.title}
                    </h6>
                    <p className="text-muted small mb-2 text-truncate-2" style={{maxHeight: '3em'}}>
                      {news.excerpt || news.content?.substring(0, 100) || 'No description'}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Badge bg="secondary" className="me-2">
                          {news.category || 'General'}
                        </Badge>
                        <small className="text-muted">
                          {news.publishedAt ? 
                            new Date(news.publishedAt).toLocaleDateString() : 
                            'No date'}
                        </small>
                      </div>
                      <div className="btn-group btn-group-sm">
                        <Button 
                          as={Link} 
                          to={`/admin/news/edit/${news._id}`}
                          variant="outline-warning" 
                          size="sm"
                          title="Edit"
                        >
                          <FaEdit />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <FaNewspaper size={48} className="text-muted mb-3 opacity-50" />
                  <p className="text-muted">No recent news</p>
                  <Button as={Link} to="/admin/news/add" variant="outline-primary" size="sm">
                    Add Your First News
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Students Table */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="card-title mb-0">Recent Students</h5>
                  <p className="text-muted small mb-0">Latest student admissions</p>
                </div>
                <Link to="/admin/students" className="btn btn-outline-primary btn-sm">
                  View All Students
                </Link>
              </div>
              
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Course</th>
                      <th>Batch</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentStudents.length > 0 ? (
                      dashboardData.recentStudents.map((student) => (
                        <tr key={student._id}>
                          <td>
                            <strong className="text-primary">{student.studentId}</strong>
                          </td>
                          <td>
                            <div>
                              <div className="fw-medium">{student.fullName}</div>
                              <small className="text-muted">{student.email}</small>
                            </div>
                          </td>
                          <td>
                            {student.courseEnrolled?.courseName || 'N/A'}
                          </td>
                          <td>
                            {student.batchYear || 'N/A'}
                            {student.semester && ` - Sem ${student.semester}`}
                          </td>
                          <td>
                            <Badge 
                              bg={
                                student.academicStatus === 'Active' ? 'success' :
                                student.academicStatus === 'Completed' ? 'info' :
                                student.academicStatus === 'On Leave' ? 'warning' : 'secondary'
                              }
                              className="px-3 py-2"
                            >
                              {student.academicStatus || 'Unknown'}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button 
                                as={Link} 
                                to={`/admin/students/${student._id}`}
                                variant="outline-primary" 
                                size="sm"
                                title="View Details"
                              >
                                <FaEye />
                              </Button>
                              <Button 
                                as={Link} 
                                to={`/admin/students/edit/${student._id}`}
                                variant="outline-warning" 
                                size="sm"
                                title="Edit"
                              >
                                <FaEdit />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <FaUsers size={48} className="text-muted mb-3 opacity-50" />
                          <p className="text-muted">No students found</p>
                          <Button 
                            as={Link} 
                            to="/admin/students/add" 
                            variant="primary"
                          >
                            <FaUserPlus className="me-2" />
                            Add Your First Student
                          </Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* System Alerts */}
      {dashboardData.alerts.length > 0 && (
        <Row className="mt-4">
          <Col>
            <Card className="border-0 shadow-sm border-warning">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <FaExclamationTriangle className="text-warning me-3" size={24} />
                  <div>
                    <h6 className="mb-1">System Alerts</h6>
                    <p className="mb-0 small">
                      {dashboardData.alerts.length} alert(s) need your attention
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AdminDashboard;