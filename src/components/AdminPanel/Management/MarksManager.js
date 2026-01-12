import React, { useState, useEffect } from 'react';
import { 
    Container, Card, Table, Button, Modal, Form, Row, Col, 
    Alert, Badge, ProgressBar, InputGroup, Toast, ToastContainer 
} from 'react-bootstrap';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { 
    FaSms, FaBell, FaChartLine, FaFilter, FaDownload, 
    FaPaperPlane, FaCheckCircle, FaExclamationTriangle 
} from 'react-icons/fa';

const MarksManager = () => {
    const [loading, setLoading] = useState(true);
    const [marks, setMarks] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingMark, setEditingMark] = useState(null);
    const [rows, setRows] = useState([{ studentId: '', theoryObtained: 0, practicalObtained: 0, vivaObtained: 0, assignmentObtained: 0 }]);
    const [meta, setMeta] = useState({ 
        examType: 'Internal', 
        course: '', 
        semester: '', 
        subject: '',
        sendSMS: false 
    });
    const [csvFile, setCsvFile] = useState(null);
    const [parsing, setParsing] = useState(false);
    const [socket, setSocket] = useState(null);
    const [realtimeNotifications, setRealtimeNotifications] = useState([]);
    const [stats, setStats] = useState(null);

    // Initialize Socket.IO
    useEffect(() => {
        const apiBase = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
        const token = localStorage.getItem('token');
        const newSocket = io(apiBase, { 
            auth: { token }, 
            transports: ['websocket', 'polling'] 
        });

        newSocket.on('connect', () => {
            console.log('✅ MarksManager socket connected:', newSocket.id);
            toast.success('Connected to real-time updates');
        });

        newSocket.on('disconnect', () => {
            console.log('❌ MarksManager socket disconnected');
            toast.error('Disconnected from real-time updates');
        });

        // Listen for marks events
        newSocket.on('marks:added', (data) => {
            console.log('📊 New marks added:', data);
            addNotification({
                type: 'success',
                title: 'New Marks Added',
                message: `${data.count} marks added for ${data.subject} (${data.examType})`,
                timestamp: new Date()
            });
            fetchMarks();
        });

        newSocket.on('marks:published', (data) => {
            console.log('📢 Marks published:', data);
            addNotification({
                type: 'info',
                title: 'Marks Published',
                message: `Marks for ${data.subject} have been published to students`,
                timestamp: new Date()
            });
            fetchMarks();
        });

        newSocket.on('marks:updated', (data) => {
            console.log('🔄 Marks updated:', data);
            addNotification({
                type: 'warning',
                title: 'Marks Updated',
                message: `Marks for ${data.subject} have been updated`,
                timestamp: new Date()
            });
            fetchMarks();
        });

        newSocket.on('marks:bulkAdded', (data) => {
            console.log('📦 Bulk marks added:', data);
            addNotification({
                type: 'success',
                title: 'Bulk Marks Processed',
                message: `Processed ${data.total} marks (${data.success} successful, ${data.failed} failed)`,
                timestamp: new Date()
            });
            
            // Show SMS notification if sent
            if (data.smsSent > 0) {
                toast.success(`${data.smsSent} SMS notifications sent to parents`);
            }
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    const addNotification = (notification) => {
        setRealtimeNotifications(prev => [
            { ...notification, id: Date.now() },
            ...prev.slice(0, 4) // Keep only last 5 notifications
        ]);
    };

    const fetchMarks = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/marks');
            setMarks(res.data.data.marks || []);
        } catch (err) {
            console.error('Fetch marks error', err);
            toast.error('Failed to load marks');
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await api.get('/admin/courses');
            setCourses(res.data.data || []);
        } catch (err) {
            console.error('Fetch courses error', err);
            toast.error('Failed to load courses');
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/marks/stats');
            setStats(res.data.data);
        } catch (err) {
            console.error('Fetch stats error', err);
        }
    };

    useEffect(() => {
        fetchMarks();
        fetchCourses();
        fetchStats();
    }, []);

    const addRow = () => setRows(prev => [...prev, { studentId: '', theoryObtained: 0, practicalObtained: 0, vivaObtained: 0, assignmentObtained: 0 }]);
    
    const removeRow = (idx) => setRows(prev => prev.filter((r, i) => i !== idx));
    
    const updateRow = (idx, key, value) => setRows(prev => prev.map((r, i) => i === idx ? { ...r, [key]: value } : r));

    const openModal = () => {
        setRows([{ studentId: '', theoryObtained: 0, practicalObtained: 0, vivaObtained: 0, assignmentObtained: 0 }]);
        setMeta({ examType: 'Internal', course: '', semester: '', subject: '', sendSMS: false });
        setCsvFile(null);
        setShowModal(true);
    };

    const openEdit = (mark) => {
        setEditingMark(mark);
        setShowEditModal(true);
    };

    const handleCsvSelect = (e) => {
        const file = e.target.files[0];
        setCsvFile(file);
    };

    const parseCsv = () => {
        if (!csvFile) return toast.error('Please select a CSV file');
        setParsing(true);
        
        const reader = new FileReader();
        reader.onload = (evt) => {
            const text = evt.target.result;
            const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            
            if (lines.length < 2) {
                setParsing(false);
                return toast.error('CSV is empty or missing rows');
            }
            
            const header = lines[0].split(',').map(h => h.trim().toLowerCase());
            const required = ['studentid'];
            
            if (!required.every(r => header.includes(r))) {
                setParsing(false);
                return toast.error('CSV must include header: studentId');
            }

            const parsedRows = lines.slice(1).map(line => {
                const cols = line.split(',');
                const obj = {};
                header.forEach((h, i) => {
                    obj[h] = cols[i] ? cols[i].trim() : '';
                });
                
                return {
                    studentId: obj.studentid || '',
                    theoryObtained: Number(obj.theory || obj.theoryobtained || 0),
                    practicalObtained: Number(obj.practical || obj.practicalobtained || 0),
                    vivaObtained: Number(obj.viva || obj.vivaobtained || 0),
                    assignmentObtained: Number(obj.assignment || obj.assignmentobtained || 0)
                };
            });

            setRows(parsedRows.filter(r => r.studentId)); // Remove empty rows
            setParsing(false);
            toast.success(`Parsed ${parsedRows.length} rows`);
        };
        
        reader.onerror = (err) => {
            setParsing(false);
            console.error('CSV read error', err);
            toast.error('Failed to read CSV file');
        };
        
        reader.readAsText(csvFile);
    };

    const handleSave = async () => {
        if (!meta.course || !meta.semester || !meta.subject) {
            return toast.error('Course, semester and subject are required');
        }
        
        try {
            const payload = {
                examType: meta.examType,
                course: meta.course,
                semester: parseInt(meta.semester, 10),
                subject: meta.subject,
                theoryMax: 100,
                practicalMax: 100,
                vivaMax: 50,
                assignmentMax: 50,
                marksData: rows.map(r => ({
                    studentId: r.studentId,
                    theoryObtained: Number(r.theoryObtained || 0),
                    practicalObtained: Number(r.practicalObtained || 0),
                    vivaObtained: Number(r.vivaObtained || 0),
                    assignmentObtained: Number(r.assignmentObtained || 0)
                })),
                sendSMS: meta.sendSMS
            };

            const res = await api.post('/admin/marks', payload);
            
            toast.success(`Marks saved successfully! ${res.data.data.success} records processed.`);
            
            if (meta.sendSMS && res.data.data.smsSent > 0) {
                toast.success(`${res.data.data.smsSent} SMS notifications sent to parents`);
            }
            
            setShowModal(false);
            fetchMarks();
            fetchStats();
            
        } catch (err) {
            console.error('Save marks error', err);
            toast.error('Failed to save marks');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this mark?')) return;
        
        try {
            await api.delete(`/admin/marks/${id}`);
            toast.success('Mark deleted successfully');
            fetchMarks();
            fetchStats();
        } catch (err) {
            console.error('Delete mark error', err);
            toast.error('Failed to delete mark');
        }
    };

    const handlePublish = async () => {
        if (!meta.course || !meta.semester || !meta.subject) {
            return toast.error('Set course/semester/subject in the modal to publish');
        }
        
        try {
            const res = await api.put('/admin/marks/publish', {
                examType: meta.examType,
                course: meta.course,
                semester: parseInt(meta.semester, 10),
                subject: meta.subject
            });
            
            toast.success(`Published ${res.data.data.modifiedCount} marks to students`);
            fetchMarks();
            
        } catch (err) {
            console.error('Publish error', err);
            toast.error('Failed to publish marks');
        }
    };

    const exportMarks = async () => {
        try {
            const response = await api.get('/admin/marks/export', {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `marks_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            toast.success('Marks exported successfully');
        } catch (err) {
            console.error('Export error', err);
            toast.error('Failed to export marks');
        }
    };

    // Calculate grade and color
    const getGradeColor = (percentage) => {
        if (percentage >= 90) return 'success';
        if (percentage >= 80) return 'success';
        if (percentage >= 70) return 'info';
        if (percentage >= 60) return 'info';
        if (percentage >= 50) return 'warning';
        if (percentage >= 40) return 'warning';
        if (percentage >= 35) return 'danger';
        return 'danger';
    };

    const getGrade = (percentage) => {
        if (percentage >= 90) return 'O';
        if (percentage >= 80) return 'A+';
        if (percentage >= 70) return 'A';
        if (percentage >= 60) return 'B+';
        if (percentage >= 50) return 'B';
        if (percentage >= 40) return 'C';
        if (percentage >= 35) return 'D';
        return 'F';
    };

    return (
        <Container fluid className="py-4">
            {/* Real-time Notifications */}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                {realtimeNotifications.map(notif => (
                    <Toast key={notif.id} 
                        onClose={() => setRealtimeNotifications(prev => prev.filter(n => n.id !== notif.id))}
                        delay={5000} 
                        autohide
                        bg={notif.type}
                    >
                        <Toast.Header closeButton>
                            <FaBell className="me-2" />
                            <strong className="me-auto">{notif.title}</strong>
                            <small>{new Date(notif.timestamp).toLocaleTimeString()}</small>
                        </Toast.Header>
                        <Toast.Body>{notif.message}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>

            {/* Header with Stats */}
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="h3 mb-2">Marks Management</h2>
                            <p className="text-muted mb-0">
                                Manage student marks with real-time updates and SMS notifications
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="outline-primary" onClick={fetchStats}>
                                <FaChartLine className="me-2" />
                                Refresh Stats
                            </Button>
                            <Button variant="primary" onClick={openModal}>
                                <FaPaperPlane className="me-2" />
                                Add Marks
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Statistics Cards */}
            {stats && (
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="text-muted mb-2">Total Records</h6>
                                        <h3 className="mb-0">{stats.overall.totalRecords}</h3>
                                    </div>
                                    <div className="bg-primary text-white rounded-circle p-3">
                                        <FaChartLine size={20} />
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
                                        <h6 className="text-muted mb-2">Average %</h6>
                                        <h3 className="mb-0">{stats.overall.averagePercentage}%</h3>
                                    </div>
                                    <div className="bg-info text-white rounded-circle p-3">
                                        <FaCheckCircle size={20} />
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
                                        <h6 className="text-muted mb-2">Pass Rate</h6>
                                        <h3 className="mb-0">{stats.overall.passPercentage}%</h3>
                                    </div>
                                    <div className="bg-success text-white rounded-circle p-3">
                                        <FaCheckCircle size={20} />
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
                                        <h6 className="text-muted mb-2">Unique Students</h6>
                                        <h3 className="mb-0">{stats.overall.totalStudents}</h3>
                                    </div>
                                    <div className="bg-warning text-white rounded-circle p-3">
                                        <FaFilter size={20} />
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Action Buttons */}
            <Row className="mb-4">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">Actions</h5>
                                <div className="d-flex gap-2">
                                    <Button variant="outline-secondary" onClick={exportMarks}>
                                        <FaDownload className="me-2" />
                                        Export CSV
                                    </Button>
                                    <Button variant="success" onClick={handlePublish}>
                                        <FaPaperPlane className="me-2" />
                                        Publish Marks
                                    </Button>
                                </div>
                            </div>
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
                                <h5 className="card-title mb-0">Marks Records</h5>
                                <small className="text-muted">
                                    Showing {marks.length} records
                                    {socket?.connected && (
                                        <Badge bg="success" className="ms-2">
                                            <FaBell className="me-1" /> Live
                                        </Badge>
                                    )}
                                </small>
                            </div>

                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3">Loading marks data...</p>
                                </div>
                            ) : marks.length > 0 ? (
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead>
                                            <tr>
                                                <th>Student</th>
                                                <th>Student ID</th>
                                                <th>Subject</th>
                                                <th>Semester</th>
                                                <th>Exam Type</th>
                                                <th>Marks Breakdown</th>
                                                <th>Total</th>
                                                <th>Percentage</th>
                                                <th>Grade</th>
                                                <th>Status</th>
                                                <th>Published</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {marks.map((m, index) => {
                                                const totalObtained = (m.marks?.theory?.obtained || 0) + 
                                                                     (m.marks?.practical?.obtained || 0) + 
                                                                     (m.marks?.viva?.obtained || 0) + 
                                                                     (m.marks?.assignment?.obtained || 0);
                                                const totalMax = (m.marks?.theory?.max || 0) + 
                                                                 (m.marks?.practical?.max || 0) + 
                                                                 (m.marks?.viva?.max || 0) + 
                                                                 (m.marks?.assignment?.max || 0);
                                                const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
                                                const grade = getGrade(percentage);
                                                const gradeColor = getGradeColor(percentage);
                                                
                                                return (
                                                    <tr key={m._id}>
                                                        <td>
                                                            <div className="fw-semibold">{m.student?.fullName || '—'}</div>
                                                            <small className="text-muted">{m.course?.courseName || '—'}</small>
                                                        </td>
                                                        <td>
                                                            <Badge bg="secondary">{m.student?.studentId || '—'}</Badge>
                                                        </td>
                                                        <td>{m.subject}</td>
                                                        <td>{m.semester}</td>
                                                        <td>
                                                            <Badge bg="info">{m.examType}</Badge>
                                                        </td>
                                                        <td>
                                                            <small className="d-block">
                                                                T: {m.marks?.theory?.obtained || 0}/{m.marks?.theory?.max || 0}
                                                            </small>
                                                            <small className="d-block">
                                                                P: {m.marks?.practical?.obtained || 0}/{m.marks?.practical?.max || 0}
                                                            </small>
                                                            <small className="d-block">
                                                                V: {m.marks?.viva?.obtained || 0}/{m.marks?.viva?.max || 0}
                                                            </small>
                                                            <small className="d-block">
                                                                A: {m.marks?.assignment?.obtained || 0}/{m.marks?.assignment?.max || 0}
                                                            </small>
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
                                                                        label={`${percentage.toFixed(1)}%`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Badge bg={gradeColor} className="fs-6">
                                                                {grade}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <Badge bg={m.resultStatus === 'Pass' ? 'success' : 'danger'}>
                                                                {m.resultStatus || 'Pending'}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            {m.isPublished ? (
                                                                <Badge bg="success">Yes</Badge>
                                                            ) : (
                                                                <Badge bg="warning">No</Badge>
                                                            )}
                                                        </td>
                                                        <td className="text-end">
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline-primary" 
                                                                className="me-2" 
                                                                onClick={() => openEdit(m)}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline-danger" 
                                                                onClick={() => handleDelete(m._id)}
                                                            >
                                                                Delete
                                                            </Button>
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
                                        No marks records available. Click "Add Marks" to create new records.
                                    </p>
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Add Marks Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaPaperPlane className="me-2" />
                        Add Marks
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="gy-3 mb-4">
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Exam Type</Form.Label>
                                    <Form.Select 
                                        value={meta.examType} 
                                        onChange={e => setMeta({ ...meta, examType: e.target.value })}
                                    >
                                        <option value="Internal">Internal</option>
                                        <option value="External">External</option>
                                        <option value="Practical">Practical</option>
                                        <option value="Assignment">Assignment</option>
                                        <option value="Project">Project</option>
                                        <option value="Terminal">Terminal</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Course</Form.Label>
                                    <Form.Select 
                                        value={meta.course} 
                                        onChange={e => setMeta({ ...meta, course: e.target.value })}
                                    >
                                        <option value="">Select Course</option>
                                        {courses.map(course => (
                                            <option key={course._id} value={course._id}>
                                                {course.courseCode} - {course.courseName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Semester</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        min="1" 
                                        max="8"
                                        value={meta.semester} 
                                        onChange={e => setMeta({ ...meta, semester: e.target.value })}
                                        placeholder="e.g., 1"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Subject</Form.Label>
                                    <Form.Control 
                                        value={meta.subject} 
                                        onChange={e => setMeta({ ...meta, subject: e.target.value })}
                                        placeholder="Enter subject name"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Check 
                            type="checkbox" 
                            id="send-sms" 
                            label={
                                <>
                                    <FaSms className="me-2 text-success" />
                                    Send SMS notification to parents
                                </>
                            }
                            checked={meta.sendSMS}
                            onChange={e => setMeta({ ...meta, sendSMS: e.target.checked })}
                            className="mb-4"
                        />

                        <hr />

                        <Row className="mb-4">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Import from CSV</Form.Label>
                                    <InputGroup>
                                        <Form.Control 
                                            type="file" 
                                            accept=".csv,.txt" 
                                            onChange={handleCsvSelect}
                                        />
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={parseCsv} 
                                            disabled={parsing || !csvFile}
                                        >
                                            {parsing ? 'Parsing...' : 'Parse'}
                                        </Button>
                                    </InputGroup>
                                    <Form.Text className="text-muted">
                                        CSV format: studentId,theory,practical,viva,assignment (one per line)
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={6} className="d-flex align-items-end">
                                <div>
                                    <Button variant="link" onClick={() => {
                                        setCsvFile(null);
                                        setRows([{ studentId: '', theoryObtained: 0, practicalObtained: 0, vivaObtained: 0, assignmentObtained: 0 }]);
                                    }}>
                                        Clear All
                                    </Button>
                                </div>
                            </Col>
                        </Row>

                        {/* Marks Input Rows */}
                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="mb-0">Marks Entry</h6>
                                <Button variant="link" onClick={addRow}>
                                    + Add Row
                                </Button>
                            </div>
                            
                            {rows.map((r, idx) => (
                                <Row key={idx} className="align-items-end gy-3 mb-3 p-3 border rounded">
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Student ID *</Form.Label>
                                            <Form.Control 
                                                value={r.studentId} 
                                                onChange={e => updateRow(idx, 'studentId', e.target.value)}
                                                placeholder="Enter Student ID"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Theory</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                min="0" 
                                                max="100"
                                                value={r.theoryObtained} 
                                                onChange={e => updateRow(idx, 'theoryObtained', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Practical</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                min="0" 
                                                max="100"
                                                value={r.practicalObtained} 
                                                onChange={e => updateRow(idx, 'practicalObtained', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Viva</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                min="0" 
                                                max="50"
                                                value={r.vivaObtained} 
                                                onChange={e => updateRow(idx, 'vivaObtained', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Assignment</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                min="0" 
                                                max="50"
                                                value={r.assignmentObtained} 
                                                onChange={e => updateRow(idx, 'assignmentObtained', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={1} className="text-end">
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            onClick={() => removeRow(idx)}
                                            disabled={rows.length === 1}
                                        >
                                            Remove
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                        </div>

                        <Alert variant="info" className="mt-4">
                            <FaExclamationTriangle className="me-2" />
                            <strong>Note:</strong> 
                            <ul className="mb-0 mt-2">
                                <li>Max marks: Theory (100), Practical (100), Viva (50), Assignment (50)</li>
                                <li>Total will be automatically calculated</li>
                                <li>Grade will be assigned based on percentage</li>
                                <li>SMS will be sent to parent's mobile number if available</li>
                            </ul>
                        </Alert>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        <FaPaperPlane className="me-2" />
                        Save Marks
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Marks Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Marks</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingMark ? (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Student</Form.Label>
                                <Form.Control 
                                    value={`${editingMark.student?.fullName || '—'} (${editingMark.student?.studentId || '—'})`} 
                                    readOnly 
                                />
                            </Form.Group>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Theory Marks</Form.Label>
                                        <Form.Control 
                                            type="number"
                                            id="edit-theory"
                                            defaultValue={editingMark.marks?.theory?.obtained || 0}
                                            min="0"
                                            max={editingMark.marks?.theory?.max || 100}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Practical Marks</Form.Label>
                                        <Form.Control 
                                            type="number"
                                            id="edit-practical"
                                            defaultValue={editingMark.marks?.practical?.obtained || 0}
                                            min="0"
                                            max={editingMark.marks?.practical?.max || 100}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Viva Marks</Form.Label>
                                        <Form.Control 
                                            type="number"
                                            id="edit-viva"
                                            defaultValue={editingMark.marks?.viva?.obtained || 0}
                                            min="0"
                                            max={editingMark.marks?.viva?.max || 50}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Assignment Marks</Form.Label>
                                        <Form.Control 
                                            type="number"
                                            id="edit-assignment"
                                            defaultValue={editingMark.marks?.assignment?.obtained || 0}
                                            min="0"
                                            max={editingMark.marks?.assignment?.max || 50}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Check 
                                type="checkbox" 
                                id="edit-publish" 
                                label="Publish to student"
                                defaultChecked={editingMark.isPublished}
                            />
                        </Form>
                    ) : (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={async () => {
                        try {
                            const payload = {
                                marks: {
                                    theory: { 
                                        obtained: Number(document.getElementById('edit-theory').value || 0) 
                                    },
                                    practical: { 
                                        obtained: Number(document.getElementById('edit-practical').value || 0) 
                                    },
                                    viva: { 
                                        obtained: Number(document.getElementById('edit-viva').value || 0) 
                                    },
                                    assignment: { 
                                        obtained: Number(document.getElementById('edit-assignment').value || 0) 
                                    }
                                },
                                isPublished: document.getElementById('edit-publish')?.checked || false
                            };
                            
                            await api.put(`/admin/marks/${editingMark._id}`, payload);
                            
                            toast.success('Mark updated successfully');
                            setShowEditModal(false);
                            setEditingMark(null);
                            fetchMarks();
                            fetchStats();
                            
                        } catch (err) {
                            console.error('Update mark error', err);
                            toast.error('Failed to update mark');
                        }
                    }}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MarksManager;