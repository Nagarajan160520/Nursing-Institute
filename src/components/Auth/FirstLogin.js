import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const FirstLogin = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Check token validity
  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await api.get(`/auth/verify-first-login/${token}`);
        if (response.data.success) {
          setValidToken(true);
        }
      } catch (error) {
        setValidToken(false);
      } finally {
        setTokenChecked(true);
      }
    };

    if (token) {
      checkToken();
    }
  }, [token]);

  // Password strength checker
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordStrength < 3) {
      toast.error('Password is too weak. Please use a stronger password.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/auth/first-login/${token}`, { password });
      
      if (response.data.success) {
        // Save token and user data
        localStorage.setItem('token', response.data.data.token);
        
        toast.success('Password set successfully! Redirecting to dashboard...');
        
        // Redirect based on role
        setTimeout(() => {
          if (response.data.data.user.role === 'student') {
            navigate('/student');
          } else {
            navigate('/dashboard');
          }
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenChecked) {
    return (
      <Container className="min-vh-100 d-flex align-items-center justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!validToken) {
    return (
      <Container className="min-vh-100 d-flex align-items-center justify-content-center">
        <Card className="shadow" style={{ width: '100%', maxWidth: '500px' }}>
          <Card.Body className="text-center p-5">
            <Alert variant="danger">
              <h4>Invalid or Expired Link</h4>
              <p>The password setup link is invalid or has expired.</p>
              <p>Please contact your institute administrator for a new link.</p>
            </Alert>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <Card className="shadow" style={{ width: '100%', maxWidth: '500px' }}>
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <FaLock size={48} className="text-primary mb-3" />
            <h2>Set Your Password</h2>
            <p className="text-muted">Create a secure password for your student account</p>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <Form.Text className="text-muted">
                Password must be at least 8 characters with uppercase, lowercase, number, and special character
              </Form.Text>
              
              {/* Password strength indicator */}
              <div className="mt-2">
                <div className="d-flex justify-content-between mb-1">
                  <small>Password Strength:</small>
                  <small>
                    {passwordStrength === 0 && 'Very Weak'}
                    {passwordStrength === 1 && 'Weak'}
                    {passwordStrength === 2 && 'Fair'}
                    {passwordStrength === 3 && 'Good'}
                    {passwordStrength >= 4 && 'Strong'}
                  </small>
                </div>
                <div className="progress" style={{ height: '5px' }}>
                  <div
                    className={`progress-bar ${
                      passwordStrength <= 1 ? 'bg-danger' :
                      passwordStrength === 2 ? 'bg-warning' :
                      passwordStrength === 3 ? 'bg-info' : 'bg-success'
                    }`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                label="Show password"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                type="submit" 
                size="lg"
                disabled={loading || passwordStrength < 3}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Setting Password...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="me-2" />
                    Set Password & Login
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 text-center">
              <small className="text-muted">
                By setting your password, you agree to our Terms of Service and Privacy Policy
              </small>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FirstLogin;