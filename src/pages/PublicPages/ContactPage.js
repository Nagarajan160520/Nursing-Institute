import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaClock } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/public/contact', formData);
      toast.success('Message sent successfully! We will contact you soon.');
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt size={30} />,
      title: 'Address',
      details: [
        'Nursing Institute of Excellence',
        '123 Medical Street, Healthcare City',
        'Tamil Nadu, India - 641001'
      ]
    },
    {
      icon: <FaPhone size={30} />,
      title: 'Phone Numbers',
      details: [
        'Admission Office: +91 98765 43210',
        'Principal Office: +91 87654 32109',
        'General Enquiry: +91 76543 21098'
      ]
    },
    {
      icon: <FaEnvelope size={30} />,
      title: 'Email Address',
      details: [
        'Admission: admission@nursinginstitute.edu',
        'Principal: principal@nursinginstitute.edu',
        'General: info@nursinginstitute.edu'
      ]
    },
    {
      icon: <FaClock size={30} />,
      title: 'Working Hours',
      details: [
        'Monday - Friday: 9:00 AM - 5:00 PM',
        'Saturday: 9:00 AM - 1:00 PM',
        'Sunday: Closed'
      ]
    }
  ];

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary mb-3">Contact Us</h1>
        <p className="lead text-muted">
          Get in touch with us for admissions, enquiries, or any other assistance.
          We're here to help you with your nursing education journey.
        </p>
      </div>

      <Row className="g-4 mb-5">
        {contactInfo.map((info, index) => (
          <Col key={index} md={6} lg={3}>
            <Card className="border-0 shadow-sm h-100 text-center">
              <Card.Body className="py-4">
                <div className="text-primary mb-3">
                  {info.icon}
                </div>
                <h5 className="mb-3">{info.title}</h5>
                <div className="text-muted">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="mb-1 small">{detail}</p>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-5">
        <Col lg={7}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <h3 className="mb-4">Send us a Message</h3>
              
              {submitted && (
                <Alert variant="success" className="mb-4">
                  Thank you for your message! We will get back to you within 24 hours.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Your Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                      />
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
                        required
                        placeholder="Enter your email"
                      />
                    </Form.Group>
                  </Col>
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
                      <Form.Label>Subject *</Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="Enter subject"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label>Message *</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Type your message here..."
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="px-5"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="me-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4 p-md-5">
              <h3 className="mb-4">Find Our Campus</h3>
              
              <div className="mb-4">
                <h5 className="text-primary mb-3">Campus Location</h5>
                <p className="text-muted">
                  Our campus is located in the heart of Healthcare City, easily 
                  accessible by public transport and private vehicles.
                </p>
              </div>

              <div className="mb-4">
                <h5 className="text-primary mb-3">How to Reach</h5>
                <ul className="list-unstyled text-muted">
                  <li className="mb-2">
                    <strong>By Bus:</strong> Take bus numbers 12, 34, 56 to Medical Street stop
                  </li>
                  <li className="mb-2">
                    <strong>By Metro:</strong> Get down at Healthcare City Metro Station
                  </li>
                  <li className="mb-2">
                    <strong>By Train:</strong> Nearest railway station is City Central (3km)
                  </li>
                  <li>
                    <strong>By Car:</strong> Ample parking available within campus
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="text-primary mb-3">Emergency Contact</h5>
                <div className="alert alert-warning">
                  <strong>For urgent matters after office hours:</strong>
                  <p className="mb-0 mt-2">+91 99999 88888 (24x7 Helpline)</p>
                </div>
              </div>

              {/* Google Maps Embed (Replace with actual embed code) */}
              <div className="mt-4">
                <div className="ratio ratio-16x9">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.123456789012!2d76.987654321!3d11.123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8a1234567890%3A0x123456789abcdef!2sNursing%20Institute!5e0!3m2!1sen!2sin!4v1234567890123"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Campus Location"
                  ></iframe>
                </div>
                <small className="text-muted mt-2 d-block">
                  Click to view in Google Maps
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <Card className="border-0 bg-light">
            <Card.Body className="text-center p-5">
              <h4 className="text-primary mb-3">Admission Enquiries</h4>
              <p className="text-muted mb-4">
                For detailed information about courses, eligibility, and admission process, 
                please visit our admission office during working hours or contact us directly.
              </p>
              <Button variant="outline-primary" size="lg" href="/courses">
                View Courses & Admission Details
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPage;