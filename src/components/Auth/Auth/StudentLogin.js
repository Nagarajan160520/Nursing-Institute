import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserGraduate } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call general login endpoint (supports student login)
      const response = await api.post('/auth/login', formData);
      
      if (response.data.success) {
        // Store token
        localStorage.setItem('token', response.data.token);
        
        // Update auth context
        login(response.data.user);
        
        toast.success('Welcome to Student Portal!');
        
        // Redirect to student dashboard
        const from = location.state?.from?.pathname || '/student';
        navigate(from, { replace: true });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Student login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 py-5">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <FaUserGraduate className="text-primary" size={48} />
                </div>
                <h3 className="fw-bold text-primary">Student Login</h3>
                <p className="text-muted">Access your student portal</p>
              </div>

              {error && (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Student Email</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaEnvelope />
                    </span>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="student@gmail.com"
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <div className="text-end mt-2">
                    <Link to="/forgot-password" className="small text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="me-2" />
                      Student Login
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="mb-2">
                    New student?{' '}
                    <Link to="/student/register" className="text-decoration-none">
                      Register Here
                    </Link>
                  </p>
                  <p className="mb-0">
                    Admin?{' '}
                    <Link to="/admin-login" className="text-decoration-none">
                      Admin Login
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Demo Student Credentials (for development) */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="border-0 shadow-sm mt-4">
              <Card.Body>
                <h6 className="mb-3">Demo Student Credentials:</h6>
                <div className="small">
                  <p className="mb-1">
                    <strong>Email:</strong> student@example.com
                  </p>
                  <p className="mb-1">
                    <strong>Password:</strong> password123
                  </p>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StudentLogin;