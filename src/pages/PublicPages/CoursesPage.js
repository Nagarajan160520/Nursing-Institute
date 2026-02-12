import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaClock, 
  FaUsers, 
  FaGraduationCap, 
  FaCalendarAlt,
  FaBook,
  FaStethoscope,
  FaRupeeSign
} from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, courses]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
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
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading courses...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Hero Section */}
      <Row className="mb-5">
        <Col>
          <div className="text-center">
            <h1 className="display-5 fw-bold mb-3 text-primary">
              Our Nursing Programs
            </h1>
            <p className="lead mb-4">
              Choose from our wide range of nursing courses designed to build 
              competent healthcare professionals
            </p>
          </div>
        </Col>
      </Row>

      {/* Search Filter */}
      <Row className="mb-5">
        <Col lg={12}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Search courses by name, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <Row className="g-4">
          {filteredCourses.map((course) => (
            <Col key={course._id} lg={4} md={6}>
              <CourseCard course={course} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5">
          <h4 className="text-muted mb-3">No courses found</h4>
          <p className="text-muted">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Statistics */}
      <Row className="mt-5 pt-5">
        <Col>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Why Choose Our Courses?</h2>
            <p className="text-muted">
              We provide quality nursing education with modern facilities and experienced faculty
            </p>
          </div>
          <Row className="g-4">
            <Col md={3} className="text-center">
              <div className="stat-number mb-2">
                <h2 className="text-primary fw-bold">100%</h2>
              </div>
              <h6>Practical Training</h6>
              <p className="text-muted small">Hands-on clinical experience</p>
            </Col>
            <Col md={3} className="text-center">
              <div className="stat-number mb-2">
                <h2 className="text-primary fw-bold">95%</h2>
              </div>
              <h6>Placement Rate</h6>
              <p className="text-muted small">Successful placements</p>
            </Col>
            <Col md={3} className="text-center">
              <div className="stat-number mb-2">
                <h2 className="text-primary fw-bold">50+</h2>
              </div>
              <h6>Expert Faculty</h6>
              <p className="text-muted small">Experienced professionals</p>
            </Col>
            <Col md={3} className="text-center">
              <div className="stat-number mb-2">
                <h2 className="text-primary fw-bold">24/7</h2>
              </div>
              <h6>Lab Access</h6>
              <p className="text-muted small">Modern lab facilities</p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

const CourseCard = ({ course }) => {
  const getCourseBadge = (courseName) => {
    if (courseName.toLowerCase().includes('gnm')) return 'primary';
    if (courseName.toLowerCase().includes('anm')) return 'success';
    if (courseName.toLowerCase().includes('b.sc')) return 'warning';
    if (courseName.toLowerCase().includes('m.sc')) return 'info';
    if (courseName.toLowerCase().includes('post')) return 'dark';
    return 'secondary';
  };

  return (
    <Card className="border-0 shadow-sm h-100 course-card">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <Badge bg={getCourseBadge(course.courseName)} className="mb-2">
              {course.courseCode}
            </Badge>
            <h5 className="fw-bold mb-1">{course.courseName}</h5>
          </div>
        </div>

        <p className="text-muted mb-4">
          {course.description?.substring(0, 120)}...
        </p>

        <div className="course-details mb-4">
          <div className="d-flex align-items-center mb-2">
            <FaClock className="text-primary me-2" />
            <span className="small">Duration: {course.duration}</span>
          </div>
          <div className="d-flex align-items-center mb-2">
            <FaUsers className="text-primary me-2" />
            <span className="small">
              Seats: {course.seatsAvailable} available
            </span>
          </div>
          <div className="d-flex align-items-center mb-2">
            <FaCalendarAlt className="text-primary me-2" />
            <span className="small">Next Batch: Soon</span>
          </div>
          {course.feesStructure?.totalFee && (
            <div className="d-flex align-items-center">
              <FaRupeeSign className="text-primary me-2" />
              <span className="small">
                Fees: ₹{course.feesStructure.totalFee.toLocaleString()}/year
              </span>
            </div>
          )}
        </div>

        {/*<div className="d-grid gap-2">
          <Button 
            as={Link} 
            to={`/courses/${course._id}`} 
            variant="primary"
            className="d-flex align-items-center justify-content-center"
          >
            <FaBook className="me-2" />
            View Details
          </Button>
          <Button 
            variant="outline-primary"
            className="d-flex align-items-center justify-content-center"
          >
            <FaStethoscope className="me-2" />
            Apply Now
          </Button>
        </div> */}
      </Card.Body>
    </Card>
  );
};

export default CoursesPage;