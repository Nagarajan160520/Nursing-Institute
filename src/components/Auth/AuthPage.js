// src/components/Auth/AuthPage.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUserShield, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AuthPage = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">
              Welcome to Nursing Institute Portal
            </h1>
            <p className="lead text-muted">
              Select your login portal to access the system
            </p>
          </div>

          <Row className="g-4">
            {/* Student Portal Card */}
            <Col md={4}>
              <Card className="border-0 shadow-lg h-100 text-center hover-card">
                <Card.Body className="p-5">
                  <div className="icon-wrapper mb-4">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '80px', height: '80px' }}>
                      <FaUserGraduate size={36} />
                    </div>
                  </div>
                  <h3 className="card-title mb-3">Student Portal</h3>
                  <p className="card-text text-muted mb-4">
                    Access your academic records, attendance, marks, study materials, 
                    and download certificates.
                  </p>
                  <div className="feature-list text-start mb-4">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <span className="text-success me-2">✓</span>
                        View Attendance & Marks
                      </li>
                      <li className="mb-2">
                        <span className="text-success me-2">✓</span>
                        Download Study Materials
                      </li>
                      <li className="mb-2">
                        <span className="text-success me-2">✓</span>
                        Access Certificates
                      </li>
                      <li className="mb-2">
                        <span className="text-success me-2">✓</span>
                        Check Clinical Schedule
                      </li>
                    </ul>
                  </div>
                  <Link 
                    to="/login" 
                    className="btn btn-primary btn-lg w-100 py-3"
                  >
                    Student Login
                  </Link>
                </Card.Body>
              </Card>
            </Col>

            {/* Admin Portal Card */}
            <Col md={4}>
              <Card className="border-0 shadow-lg h-100 text-center hover-card">
                <Card.Body className="p-5">
                  <div className="icon-wrapper mb-4">
                    <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '80px', height: '80px' }}>
                      <FaUserShield size={36} />
                    </div>
                  </div>
                  <h3 className="card-title mb-3">Admin Portal</h3>
                  <p className="card-text text-muted mb-4">
                    Full control over institute management, website content, 
                    student records, and system administration.
                  </p>
                  <div className="feature-list text-start mb-4">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <span className="text-success me-2">✓</span>
                        Manage Website Content
                      </li>
                      <li className="mb-2">
                        <span className="text-success me-2">✓</span>
                        Handle Student Records
                      </li>
                      <li className="mb-2">
                        <span className="text-success me-2">✓</span>
                        Upload Gallery & News
                      </li>
                      <li className="mb-2">
                        <span className="text-success me-2">✓</span>
                        Full System Control
                      </li>
                    </ul>
                  </div>
                  <Link 
                    to="/admin-login" 
                    className="btn btn-danger btn-lg w-100 py-3"
                  >
                    Admin Login
                  </Link>
                </Card.Body>
              </Card>
            </Col>

            {/* Faculty Portal Card */}
            <Col md={4}>
              <Card className="border-0 shadow-lg h-100 text-center hover-card">
                <Card.Body className="p-5">
                  <div className="icon-wrapper mb-4">
                    <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '80px', height: '80px' }}>
                      <FaChalkboardTeacher size={36} />
                    </div>
                  </div>
                  <h3 className="card-title mb-3">Faculty Portal</h3>
                  <p className="card-text text-muted mb-4">
                    Access teaching materials, student evaluation, 
                    attendance marking, and academic resources.
                  </p>
                  <div className="feature-list text-start mb-4">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <span className="text-success me-2">✓</span>
                        Mark Student Attendance
                      </li>
                      <li className="mb-2">
                        <span className="text-success me-2">✓</span>
                        Enter Internal Marks
                      </li>
                      <li className="mb-2">
                        <span className="text-success me-2">✓</span>
                        Upload Study Materials
                      </li>
                      <li className="mb-2">
                        <span className="text-success me-2">✓</span>
                        Academic Resources
                      </li>
                    </ul>
                  </div>
                  <Link 
                    to="/faculty-login" 
                    className="btn btn-warning btn-lg w-100 py-3"
                  >
                    Faculty Login
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Additional Information */}
          <Card className="border-0 shadow-sm mt-5">
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <h5 className="mb-2">Need Help?</h5>
                  <p className="text-muted mb-0">
                    If you're facing any issues with login or access, please contact 
                    the institute administration at <strong>support@nursinginstitute.edu</strong> 
                    or call <strong>+91 9876543210</strong>.
                  </p>
                </Col>
                <Col md={4} className="text-md-end">
                  <Link to="/" className="btn btn-outline-primary">
                    ← Back to Home
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Demo Credentials */}
          <Card className="border-0 shadow-sm mt-4">
            <Card.Body>
              <h5 className="mb-3">Demo Login Credentials:</h5>
              <Row>
                <Col md={4}>
                  <div className="border rounded p-3 mb-3">
                    <h6 className="text-primary mb-2">Student</h6>
                    <p className="mb-1"><strong>Email:</strong> student@example.com</p>
                    <p className="mb-0"><strong>Password:</strong> student123</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="border rounded p-3 mb-3">
                    <h6 className="text-danger mb-2">Admin</h6>
                    <p className="mb-1"><strong>Email:</strong> admin@institute.edu</p>
                    <p className="mb-0"><strong>Password:</strong> admin123</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="border rounded p-3 mb-3">
                    <h6 className="text-warning mb-2">Faculty</h6>
                    <p className="mb-1"><strong>Email:</strong> faculty@institute.edu</p>
                    <p className="mb-0"><strong>Password:</strong> faculty123</p>
                  </div>
                </Col>
              </Row>
              <div className="alert alert-info mt-3 mb-0">
                <small>
                  <strong>Note:</strong> These are demo credentials. In production, 
                  users will have their own credentials provided by the institute.
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add CSS for hover effect */}
      <style>
        {`
          .hover-card {
            transition: all 0.3s ease;
            border: 2px solid transparent;
          }
          
          .hover-card:hover {
            transform: translateY(-10px);
            border-color: #2c3e50;
            box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
          }
          
          .icon-wrapper {
            transition: transform 0.3s ease;
          }
          
          .hover-card:hover .icon-wrapper {
            transform: scale(1.1);
          }
        `}
      </style>
    </Container>
  );
};

export default AuthPage;