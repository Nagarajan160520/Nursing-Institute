import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaGraduationCap, 
  FaClock, 
  FaUserGraduate, 
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaBookMedical
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [durationFilter, setDurationFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, durationFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/public/courses');
      setCourses(response.data.data || []);
      setFilteredCourses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Duration filter
    if (durationFilter !== 'all') {
      filtered = filtered.filter(course =>
        course.duration.includes(durationFilter)
      );
    }

    setFilteredCourses(filtered);
  };

  const durations = [
    { value: 'all', label: 'All Durations' },
    { value: '6 Months', label: '6 Months' },
    { value: '1 Year', label: '1 Year' },
    { value: '2 Years', label: '2 Years' },
    { value: '3 Years', label: '3 Years' },
    { value: '4 Years', label: '4 Years' }
  ];

  const getCourseType = (duration) => {
    if (duration.includes('Month')) return 'Certificate';
    if (duration.includes('Diploma')) return 'Diploma';
    if (duration.includes('Degree')) return 'Degree';
    return 'Diploma';
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'Certificate': return 'warning';
      case 'Diploma': return 'info';
      case 'Degree': return 'success';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading courses...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="text-center mb-3 text-primary">Our Courses</h1>
          <p className="text-center text-muted lead mb-0">
            Explore our comprehensive nursing programs designed to prepare 
            competent healthcare professionals.
          </p>
        </Col>
      </Row>

      {/* Search and Filter Section */}
      <Row className="mb-4 g-3">
        <Col md={8}>
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="Search courses by name, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-3 ps-5"
            />
            <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
          </div>
        </Col>
        <Col md={4}>
          <div className="d-flex align-items-center">
            <FaFilter className="me-2 text-muted" />
            <Form.Select 
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="py-3"
            >
              {durations.map(duration => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </Form.Select>
          </div>
        </Col>
      </Row>

      {/* Results Count */}
      <Row className="mb-4">
        <Col>
          <p className="text-muted">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </Col>
      </Row>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Row>
          <Col>
            <Alert variant="info" className="text-center py-4">
              <FaSearch size={48} className="mb-3 text-muted" />
              <h4>No courses found</h4>
              <p className="mb-0">Try adjusting your search or filter criteria</p>
            </Alert>
          </Col>
        </Row>
      ) : (
        <Row className="g-4">
          {filteredCourses.map((course) => {
            const courseType = getCourseType(course.duration);
            const badgeColor = getBadgeColor(courseType);
            
            return (
              <Col key={course._id} lg={4} md={6}>
                <Card className="h-100 border-0 shadow-sm course-card">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span className={`badge bg-${badgeColor} mb-2`}>
                          {courseType}
                        </span>
                        <h4 className="mb-2">{course.courseName}</h4>
                        <p className="text-muted mb-0">
                          <small>Code: {course.courseCode}</small>
                        </p>
                      </div>
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                           style={{ width: '50px', height: '50px' }}>
                        <FaGraduationCap size={20} />
                      </div>
                    </div>

                    <p className="text-muted mb-4" style={{ minHeight: '60px' }}>
                      {course.description.length > 120 
                        ? `${course.description.substring(0, 120)}...` 
                        : course.description}
                    </p>

                    <div className="course-details mb-4">
                      <div className="d-flex align-items-center mb-2">
                        <FaClock className="me-2 text-primary" />
                        <span className="text-muted">Duration: </span>
                        <strong className="ms-1">{course.duration}</strong>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FaUserGraduate className="me-2 text-primary" />
                        <span className="text-muted">Seats: </span>
                        <strong className="ms-1">
                          {course.seatsAvailable || 30} available
                        </strong>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaBookMedical className="me-2 text-primary" />
                        <span className="text-muted">Clinical Training: </span>
                        <strong className="ms-1">Included</strong>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <Button
                        as={Link}
                        to={`/courses/${course._id}`}
                        variant="outline-primary"
                        className="px-4"
                      >
                        View Details
                      </Button>
                      <Button
                        as={Link}
                        to="/contact"
                        variant="primary"
                        className="px-4"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Course Types Info */}
      <Row className="mt-5 pt-5">
        <Col>
          <h3 className="text-center mb-4">Types of Nursing Programs</h3>
          <Row className="g-4">
            <Col md={4}>
              <Card className="border-0 shadow-sm h-100 text-center">
                <Card.Body className="p-4">
                  <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <FaGraduationCap size={24} />
                  </div>
                  <h5>Certificate Programs</h5>
                  <p className="text-muted mb-0">
                    Short-term courses (6 months - 1 year) for basic nursing skills and specialization.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm h-100 text-center">
                <Card.Body className="p-4">
                  <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <FaCalendarAlt size={24} />
                  </div>
                  <h5>Diploma Programs</h5>
                  <p className="text-muted mb-0">
                    2-3 year comprehensive programs for registered nurse certification.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm h-100 text-center">
                <Card.Body className="p-4">
                  <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <FaBookMedical size={24} />
                  </div>
                  <h5>Degree Programs</h5>
                  <p className="text-muted mb-0">
                    4-year Bachelor's programs for advanced nursing education and leadership.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseList;