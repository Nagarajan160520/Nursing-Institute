import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert, Spinner } from 'react-bootstrap';
import { FaClock, FaCalendarWeek, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../../../services/api';
import useAutoRefresh from '../../../hooks/useAutoRefresh';
import toast from 'react-hot-toast';

const Timetable = () => {
  const [timetableData, setTimetableData] = useState({});
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState({});

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await api.get('/student/timetable');
      const data = response?.data?.data || {};
      setTimetableData(data.timetableByDay || {});
      setStudentInfo(data.student || {});
    } catch (error) {
      toast.error('Failed to fetch timetable data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh timetable every 30 minutes
  useAutoRefresh(fetchTimetable, 1800000);

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      'Theory': { variant: 'primary', icon: '📚' },
      'Practical': { variant: 'success', icon: '🔬' },
      'Clinical': { variant: 'info', icon: '🏥' },
      'Tutorial': { variant: 'warning', icon: '💡' },
      'Lab': { variant: 'secondary', icon: '🧪' },
      'Lecture': { variant: 'dark', icon: '🎓' }
    };

    const config = typeConfig[type] || { variant: 'secondary', icon: '📖' };

    return (
      <Badge bg={config.variant} className="d-flex align-items-center gap-1">
        <span>{config.icon}</span>
        <span>{type}</span>
      </Badge>
    );
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const isToday = (day) => day === today;

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-2">Class Timetable</h2>
          <p className="text-muted mb-0">
            Your weekly schedule for Semester {studentInfo.semester}
          </p>
        </div>
        <div className="text-end">
          <small className="text-muted d-block">
            Course: {studentInfo.course?.courseName || 'N/A'}
          </small>
          <small className="text-muted">
            Last updated: {new Date().toLocaleString()}
          </small>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading your timetable...</p>
        </div>
      ) : Object.keys(timetableData).length > 0 ? (
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title mb-0">
                    <FaCalendarWeek className="me-2" />
                    Weekly Schedule
                  </h5>
                  <Badge bg="info" className="fs-6">
                    Today: {today}
                  </Badge>
                </div>

                <div className="table-responsive">
                  <Table bordered hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th className="text-center" style={{ width: '15%' }}>Day</th>
                        <th className="text-center">Schedule</th>
                      </tr>
                    </thead>
                    <tbody>
                      {daysOfWeek.map(day => (
                        <tr key={day} className={isToday(day) ? 'table-primary' : ''}>
                          <td className="text-center fw-bold">
                            <div className="d-flex flex-column align-items-center">
                              <span>{day}</span>
                              {isToday(day) && (
                                <Badge bg="success" className="mt-1">Today</Badge>
                              )}
                            </div>
                          </td>
                          <td>
                            {timetableData[day] && timetableData[day].length > 0 ? (
                              <div className="d-flex flex-column gap-3">
                                {timetableData[day]
                                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                  .map((session, index) => (
                                    <Card key={index} className="border-start border-4 border-primary">
                                      <Card.Body className="py-3">
                                        <Row className="align-items-center">
                                          <Col md={3}>
                                            <div className="d-flex align-items-center mb-2">
                                              <FaClock className="text-primary me-2" />
                                              <strong>
                                                {formatTime(session.startTime)} - {formatTime(session.endTime)}
                                              </strong>
                                            </div>
                                          </Col>
                                          <Col md={6}>
                                            <div className="mb-2">
                                              <h6 className="mb-1">{session.subject}</h6>
                                              <div className="d-flex align-items-center gap-2 mb-1">
                                                <FaUser className="text-muted" size={12} />
                                                <small className="text-muted">{session.faculty}</small>
                                              </div>
                                              <div className="d-flex align-items-center gap-2">
                                                <FaMapMarkerAlt className="text-muted" size={12} />
                                                <small className="text-muted">{session.room}</small>
                                              </div>
                                            </div>
                                          </Col>
                                          <Col md={3} className="text-end">
                                            {getTypeBadge(session.type)}
                                          </Col>
                                        </Row>
                                      </Card.Body>
                                    </Card>
                                  ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-muted">
                                <FaCalendarWeek className="mb-2" size={24} />
                                <p className="mb-0">No classes scheduled</p>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Alert variant="info" className="text-center py-5">
          <FaCalendarWeek size={48} className="mb-3 text-muted" />
          <h4 className="alert-heading">No Timetable Available</h4>
          <p className="mb-0">
            Your timetable for this semester is not yet available.
            Please contact your course coordinator or check back later.
          </p>
        </Alert>
      )}

      {/* Timetable Legend */}
      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-3">Session Types</h5>
              <Row>
                {Object.entries({
                  'Theory': 'primary',
                  'Practical': 'success',
                  'Clinical': 'info',
                  'Tutorial': 'warning',
                  'Lab': 'secondary',
                  'Lecture': 'dark'
                }).map(([type, variant]) => (
                  <Col md={4} key={type} className="mb-3">
                    <div className="d-flex align-items-center">
                      <Badge bg={variant} className="me-2">
                        {type === 'Theory' ? '📚' :
                         type === 'Practical' ? '🔬' :
                         type === 'Clinical' ? '🏥' :
                         type === 'Tutorial' ? '💡' :
                         type === 'Lab' ? '🧪' : '🎓'}
                      </Badge>
                      <span>{type}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Timetable;
