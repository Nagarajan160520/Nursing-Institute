import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Alert, ProgressBar } from 'react-bootstrap';
import { FaChartLine, FaFileExport, FaFilter, FaAward, FaExclamationTriangle, FaBell } from 'react-icons/fa';
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
import { io } from 'socket.io-client';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const StudentMarksPage = () => {
    const [marksData, setMarksData] = useState([]);
    const [semesterStats, setSemesterStats] = useState({});
    const [studentInfo, setStudentInfo] = useState(null);
    const [filters, setFilters] = useState({
        semester: '',
        subject: '',
        examType: ''
    });
    const [subjects, setSubjects] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [newMarksNotification, setNewMarksNotification] = useState(null);

    useEffect(() => {
        fetchStudentData();
        fetchMarksData();
    }, [filters]);

    useEffect(() => {
        // Setup Socket.IO for real-time updates
        const apiBase = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
        const token = localStorage.getItem('token');
        const newSocket = io(apiBase, { 
            auth: { token }, 
            transports: ['websocket', 'polling'] 
        });

        newSocket.on('connect', () => {
            console.log('✅ Student marks socket connected');
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Student marks socket disconnected');
        });

        newSocket.on('marks:added', (data) => {
            console.log('📊 New marks received:', data);
            
            if (data.studentId === studentInfo?.studentId || 
                (!data.studentId && data.subject)) {
                setNewMarksNotification({
                    subject: data.subject,
                    examType: data.examType,
                    semester: data.semester,
                    timestamp: new Date()
                });
                
                toast.info(`New marks published for ${data.subject} (${data.examType})`);
                fetchMarksData(); // Refresh marks
            }
        });

        newSocket.on('marks:published', (data) => {
            console.log('📢 Marks published:', data);
            toast.info(`Marks for ${data.subject} have been published`);
            fetchMarksData();
        });

        newSocket.on('marks:updated', (data) => {
            console.log('🔄 Marks updated:', data);
            toast.info(`Marks for ${data.subject} have been updated`);
            fetchMarksData();
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [studentInfo]);

    const fetchStudentData = async () => {
        try {
            const response = await api.get('/student/profile');
            setStudentInfo(response.data.data);
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };

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
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            let filename = 'marks_report.csv';
            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('Marks report downloaded successfully!', { id: 'download-marks' });
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download marks report', { id: 'download-marks' });
        }
    };

    // Prepare chart data
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
            {/* New Marks Notification */}
            {newMarksNotification && (
                <Alert 
                    variant="info" 
                    className="mb-4" 
                    dismissible 
                    onClose={() => setNewMarksNotification(null)}
                >
                    <div className="d-flex align-items-center">
                        <FaBell className="me-2" />
                        <div>
                            <strong>New Marks Published!</strong>
                            <p className="mb-0">
                                {newMarksNotification.subject} ({newMarksNotification.examType}) - 
                                Semester {newMarksNotification.semester}
                            </p>
                        </div>
                    </div>
                </Alert>
            )}

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h3 mb-2">My Marks</h2>
                    <p className="text-muted mb-0">
                        View your academic performance and marks
                        {socket?.connected && (
                            <Badge bg="success" className="ms-2">
                                <FaBell className="me-1" /> Live Updates
                            </Badge>
                        )}
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

            {/* Student Info Card */}
            {studentInfo && (
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <div className="bg-primary text-white rounded-circle p-3">
                                            <FaChartLine size={24} />
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="mb-1">{studentInfo.fullName}</h5>
                                        <p className="text-muted mb-0">
                                            {studentInfo.studentId} • {studentInfo.courseEnrolled?.courseName}
                                        </p>
                                        <p className="mb-0">
                                            Semester {studentInfo.semester} • Batch {studentInfo.batchYear}
                                        </p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="d-flex justify-content-end h-100">
                                    <div className="text-center me-4">
                                        <h6 className="text-muted mb-2">Overall CGPA</h6>
                                        <h3 className="mb-0 text-primary">{studentInfo.cgpa || '0.00'}</h3>
                                    </div>
                                    <div className="text-center">
                                        <h6 className="text-muted mb-2">Current Semester</h6>
                                        <h3 className="mb-0 text-success">{studentInfo.semester}</h3>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}

            {/* Performance Overview */}
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
                                        <option value="Project">Project</option>
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
                                                <th>Viva</th>
                                                <th>Assignment</th>
                                                <th>Total</th>
                                                <th>Percentage</th>
                                                <th>Grade</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {marksData.map((mark, index) => {
                                                const totalObtained = mark.totalMarks?.obtained || 0;
                                                const totalMax = mark.totalMarks?.max || 300;
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
                                                            {mark.marks?.viva?.obtained || 0}/{mark.marks?.viva?.max || 0}
                                                        </td>
                                                        <td>
                                                            {mark.marks?.assignment?.obtained || 0}/{mark.marks?.assignment?.max || 0}
                                                        </td>
                                                        <td>
                                                            <strong>{totalObtained}/{totalMax}</strong>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div className="me-2" style={{ width: '60px' }}>
                                                                    <ProgressBar 
                                                                        now={percentage} 
                                                                        variant={percentage >= 35 ? 'success' : 'danger'}
                                                                        label={`${percentage}%`}
                                                                    />
                                                                </div>
                                                                <span className={percentage >= 35 ? 'text-success' : 'text-danger'}>
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
        </Container>
    );
};

export default StudentMarksPage;