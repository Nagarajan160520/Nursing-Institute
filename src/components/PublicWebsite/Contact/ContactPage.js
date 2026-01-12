import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCheckCircle } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'General'
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="text-primary" size={24} />,
      title: 'Visit Our Campus',
      details: [
        'Nursing Institute of Excellence',
        '123 Medical Education Road',
        'City, State 600001',
        'India'
      ]
    },
    {
      icon: <FaPhone className="text-success" size={24} />,
      title: 'Call Us',
      details: [
        'Admission Office: +91-9876543210',
        'Principal Office: +91-9876543211',
        'Administration: +91-9876543212',
        'Emergency: +91-9876543213'
      ],
      timing: 'Mon-Sat: 9:00 AM - 6:00 PM'
    },
    {
      icon: <FaEnvelope className="text-danger" size={24} />,
      title: 'Email Us',
      details: [
        'Admissions: admissions@nursinginstitute.edu',
        'Principal: principal@nursinginstitute.edu',
        'Support: support@nursinginstitute.edu',
        'Placement: placement@nursinginstitute.edu'
      ]
    },
    {
      icon: <FaClock className="text-warning" size={24} />,
      title: 'Working Hours',
      details: [
        'Monday - Friday: 9:00 AM - 6:00 PM',
        'Saturday: 9:00 AM - 2:00 PM',
        'Sunday: Closed',
        'Library: 8:00 AM - 8:00 PM'
      ]
    }
  ];

  const categories = [
    { value: 'General', label: 'General Inquiry' },
    { value: 'Admission', label: 'Admission Related' },
    { value: 'Course', label: 'Course Information' },
    { value: 'Fee', label: 'Fee Structure' },
    { value: 'Complaint', label: 'Complaint' },
    { value: 'Suggestion', label: 'Suggestion' },
    { value: 'Other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/public/contact', formData);
      
      if (response.data.success) {
        toast.success('Message sent successfully!');
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          category: 'General'
        });
        
        // Reset after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Container className="py-5">
      {/* Success Message */}
      {submitted && (
        <Alert variant="success" className="d-flex align-items-center">
          <FaCheckCircle className="me-2" />
          Thank you for contacting us! We'll get back to you within 24-48 hours.
        </Alert>
      )}

      <h1 className="mb-4 text-center">Contact Us</h1>
      <p className="text-muted text-center mb-5">
        Have questions? We're here to help. Get in touch with us through any of the following ways.
      </p>

      <Row className="g-4 mb-5">
        {/* Contact Info Cards */}
        {contactInfo.map((info, index) => (
          <Col key={index} xs={12} md={6} lg={3}>
            <Card className="border-0 shadow-sm h-100 text-center">
              <Card.Body className="py-4">
                <div className="mb-3">
                  {info.icon}
                </div>
                <h5 className="card-title mb-3">{info.title}</h5>
                <div className="text-muted">
                  {info.details.map((detail, i) => (
                    <p key={i} className="mb-1">{detail}</p>
                  ))}
                  {info.timing && (
                    <p className="mt-2 mb-0 text-success">
                      <small>{info.timing}</small>
                    </p>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Contact Form Section */}
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-4 p-md-5">
              <h3 className="mb-4 text-center">Send Us a Message</h3>
              <p className="text-muted text-center mb-4">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Your Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        isInvalid={!!errors.name}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        isInvalid={!!errors.email}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    isInvalid={!!errors.subject}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.subject}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Your Message *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please provide details about your inquiry..."
                    isInvalid={!!errors.message}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.message}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Please be as detailed as possible so we can assist you better.
                  </Form.Text>
                </Form.Group>

                <div className="text-center">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="px-5"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </div>
              </Form>

              <div className="mt-4 text-center text-muted small">
                <p className="mb-0">
                  By submitting this form, you agree to our Privacy Policy and Terms of Service.
                </p>
                <p className="mb-0">
                  We typically respond within 24-48 hours during business days.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Google Map Section */}
      <Row className="mt-5">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h4 className="mb-4">Find Us on Map</h4>
              <div className="ratio ratio-16x9">
                <iframe
                  title="Institute Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.013074855524!2d80.20915731534933!3d12.971762518252354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d7088a8af7d%3A0x1a35b4c9b5c0b5c5!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
              <div className="mt-3 text-center">
                <Button
                  variant="outline-primary"
                  href="https://maps.google.com/?q=Nursing+Institute+Chennai"
                  target="_blank"
                  className="mt-2"
                >
                  Get Directions
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPage;