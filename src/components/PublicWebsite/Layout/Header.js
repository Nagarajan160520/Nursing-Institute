import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Header = () => {
  return (
    <div className="bg-dark text-white py-2 d-none d-md-block">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-4">
                <FaPhone size={14} className="me-2" />
                <small>+91 9876543210</small>
              </div>
              <div className="d-flex align-items-center me-4">
                <FaEnvelope size={14} className="me-2" />
                <small>info@nursinginstitute.edu</small>
              </div>
              <div className="d-flex align-items-center">
                <FaClock size={14} className="me-2" />
                <small>Mon - Sat: 9:00 AM - 5:00 PM</small>
              </div>
            </div>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="d-flex align-items-center justify-content-md-end">
              <span className="me-3 small">Follow us:</span>
              <div className="d-flex gap-2">
                <a href="https://facebook.com" className="text-white" target="_blank" rel="noopener noreferrer">
                  <FaFacebook size={16} />
                </a>
                <a href="https://twitter.com" className="text-white" target="_blank" rel="noopener noreferrer">
                  <FaTwitter size={16} />
                </a>
                <a href="https://instagram.com" className="text-white" target="_blank" rel="noopener noreferrer">
                  <FaInstagram size={16} />
                </a>
                <a href="https://linkedin.com" className="text-white" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin size={16} />
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Header;