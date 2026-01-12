import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Alert, Dropdown } from 'react-bootstrap';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaMapMarkerAlt,
  FaBook,
  FaUpload,
  FaDownload
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const TimetableManager = () => {
  const [timetables, setTimetables] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);

  // Timetable form state
  const [timetableForm, setTimetableForm] = useState({
    course: '',
    semester: 1,
    day: 'Monday',
    subject: '',
    startTime: '',
    endTime: '',
    type: 'Theory',
    faculty: '',
    room: '',
    isActive: true
  });

  useEffect(() => {
    fetchCourses();
    fetchTimetables();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/admin/courses');
      setCourses(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch courses');
    }
  };

  const fetchTimetables = async () => {
    try {
      const response = await api.get('/admin/timetable');
      setTimetables(response.data.data?.timetables || []);
    } catch (error) {
      toast.error('Failed to fetch timetables');
    } finally {
      setLoading(false);
    }
  };

  const filteredTimetables = timetables.filter(timetable => {
    const matchesSearch = !searchTerm ||
      timetable.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timetable.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timetable.room.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse = !selectedCourse || timetable.course._id === selectedCourse;
    const matchesSemester = !selectedSemester || timetable.semester === parseInt(selectedSemester);

    return matchesSearch && matchesCourse && matchesSemester;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingTimetable) {
        // Update timetable
        await api.put(`/admin/timetable/${editingTimetable._id}`, timetableForm);
        toast.success('Timetable entry updated successfully!');
      } else {
        // Create new timetable entry
        await api.post('/admin/timetable', timetableForm);
        toast.success('Timetable entry created successfully!');
      }

      setShowModal(false);
      setEditingTimetable(null);
      resetForm();
      fetchTimetables();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTimetableForm({
      course: selectedCourse || '',
      semester: selectedSemester || 1,
      day: 'Monday',
      subject: '',
      startTime: '',
      endTime: '',
      type: 'Theory',
      faculty: '',
      room: '',
      isActive: true
    });
  };

  const handleEdit = (timetable) => {
    setEditingTimetable(timetable);
    setTimetableForm({
      course: timetable.course._id,
      semester: timetable.semester,
      day: timetable.day,
      subject: timetable.subject,
      startTime: timetable.startTime,
      endTime: timetable.endTime,
      type: timetable.type,
      faculty: timetable.faculty,
      room: timetable.room,
      isActive: timetable.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this timetable entry?')) return;

    try {
      await api.delete(`/admin/timetable/${id}`);
      toast.success('Timetable entry deleted successfully');
      fetchTimetables();
    } catch (error) {
      toast.error('Failed to delete timetable entry');
    }
  };

  const toggleTimetableStatus = async (timetable) => {
    try {
      await api.put(`/admin/timetable/${timetable._id}`, {
        isActive: !timetable.isActive
      });
      toast.success(`Timetable entry ${!timetable.isActive ? 'activated' : 'deactivated'} successfully`);
      fetchTimetables();
    } catch (error) {
      toast.error('Failed to update timetable status');
    }
  };

  const getDayOrder = (day) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.indexOf(day);
  };

  const sortedTimetables = filteredTimetables.sort((a, b) => {
    if (a.day !== b.day) {
      return getDayOrder(a.day) - getDayOrder(b.day);
    }
    return a.startTime.localeCompare(b.startTime);
  });

  const getCourseName = (courseId) => {
    const course = courses.find(c => c._id === courseId);
    return course ? course.courseName : 'Unknown Course';
  };

  const getCourseCode = (courseId) => {
    const course = courses.find(c => c._id === courseId);
    return course ? course.courseCode : 'Unknown';
  };

  if (loading && timetables.length === 0) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading timetable...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-2">Timetable Management</h2>
          <p className="text-muted mb-0">Manage course timetables and schedules</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary">
            <FaDownload className="me-2" />
            Export
          </Button>
          <Button variant="outline-secondary">
            <FaUpload className="me-2" />
            Bulk Upload
          </Button>
          <Button variant="primary" onClick={() => {
            resetForm();
            setShowModal(true);
          }}>
            <FaPlus className="me-2" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Course</Form.Label>
                <Form.Select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="">All Courses</option>
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
                <Form.Select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                >
                  <option value="">All</option>
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Search by subject, faculty, room..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>&nbsp;</Form.Label>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setSelectedCourse('');
                      setSelectedSemester('');
                      setSearchTerm('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Timetable Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Faculty</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTimetables.map((timetable) => (
                  <tr key={timetable._id}>
                    <td>
                      <div>
                        <strong>{getCourseCode(timetable.course._id)}</strong>
                        <small className="d-block text-muted">{getCourseName(timetable.course._id)}</small>
                      </div>
                    </td>
                    <td>
                      <Badge bg="info">Sem {timetable.semester}</Badge>
                    </td>
                    <td>
                      <strong>{timetable.day}</strong>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaClock className="me-1 text-muted" />
                        {timetable.startTime} - {timetable.endTime}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaBook className="me-2 text-primary" />
                        {timetable.subject}
                      </div>
                    </td>
                    <td>
                      <Badge bg={
                        timetable.type === 'Theory' ? 'primary' :
                        timetable.type === 'Practical' ? 'success' :
                        timetable.type === 'Clinical' ? 'warning' : 'secondary'
                      }>
                        {timetable.type}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaUser className="me-1 text-muted" />
                        {timetable.faculty}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaMapMarkerAlt className="me-1 text-muted" />
                        {timetable.room}
                      </div>
                    </td>
                    <td>
                      <Badge bg={timetable.isActive ? 'success' : 'danger'}>
                        {timetable.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEdit(timetable)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => toggleTimetableStatus(timetable)}
                        >
                          {timetable.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(timetable._id)}
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

          {sortedTimetables.length === 0 && (
            <div className="text-center py-5">
              <FaCalendarAlt size={48} className="text-muted mb-3" />
              <h5>No timetable entries found</h5>
              <p className="text-muted">
                {selectedCourse || selectedSemester || searchTerm
                  ? 'Try adjusting your filters or add a new timetable entry'
                  : 'Add your first timetable entry to get started'
                }
              </p>
              <Button variant="primary" onClick={() => {
                resetForm();
                setShowModal(true);
              }}>
                <FaPlus className="me-2" />
                Add Timetable Entry
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Timetable Form Modal */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setEditingTimetable(null);
      }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTimetable ? 'Edit Timetable Entry' : 'Add New Timetable Entry'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course *</Form.Label>
                  <Form.Select
                    value={timetableForm.course}
                    onChange={(e) => setTimetableForm({...timetableForm, course: e.target.value})}
                    required
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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Semester *</Form.Label>
                  <Form.Select
                    value={timetableForm.semester}
                    onChange={(e) => setTimetableForm({...timetableForm, semester: parseInt(e.target.value)})}
                    required
                  >
                    {[1,2,3,4,5,6,7,8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Day *</Form.Label>
                  <Form.Select
                    value={timetableForm.day}
                    onChange={(e) => setTimetableForm({...timetableForm, day: e.target.value})}
                    required
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type *</Form.Label>
                  <Form.Select
                    value={timetableForm.type}
                    onChange={(e) => setTimetableForm({...timetableForm, type: e.target.value})}
                    required
                  >
                    <option value="Theory">Theory</option>
                    <option value="Practical">Practical</option>
                    <option value="Clinical">Clinical</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time *</Form.Label>
                  <Form.Control
                    type="time"
                    value={timetableForm.startTime}
                    onChange={(e) => setTimetableForm({...timetableForm, startTime: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time *</Form.Label>
                  <Form.Control
                    type="time"
                    value={timetableForm.endTime}
                    onChange={(e) => setTimetableForm({...timetableForm, endTime: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Subject *</Form.Label>
              <Form.Control
                type="text"
                value={timetableForm.subject}
                onChange={(e) => setTimetableForm({...timetableForm, subject: e.target.value})}
                placeholder="e.g., Anatomy, Physiology, Nursing Fundamentals"
                required
              />
            </Form.Group>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Faculty *</Form.Label>
                  <Form.Control
                    type="text"
                    value={timetableForm.faculty}
                    onChange={(e) => setTimetableForm({...timetableForm, faculty: e.target.value})}
                    placeholder="Faculty name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Room *</Form.Label>
                  <Form.Control
                    type="text"
                    value={timetableForm.room}
                    onChange={(e) => setTimetableForm({...timetableForm, room: e.target.value})}
                    placeholder="e.g., Room 101, Lab A, Hall B"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active Entry"
                checked={timetableForm.isActive}
                onChange={(e) => setTimetableForm({...timetableForm, isActive: e.target.checked})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowModal(false);
              setEditingTimetable(null);
            }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : (editingTimetable ? 'Update Entry' : 'Create Entry')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default TimetableManager;
