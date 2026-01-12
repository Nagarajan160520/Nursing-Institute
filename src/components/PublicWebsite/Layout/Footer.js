import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram,
  FaLinkedin,
  FaUserShield

} from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';

const Footer = () => {
  const { user } = useAuth();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-nursing">
      <Container>
        <Row className="g-4">
          <Col lg={4} md={6}>
            <h5 className="mb-4">Nursing Institute</h5>
            <p className="text-light mb-4">
              Providing quality nursing education since 1995. 
              We are committed to producing competent and compassionate 
              nursing professionals for the healthcare industry.
            </p>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" className="text-light" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-light" target="_blank" rel="noopener noreferrer">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-light" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={20} />
              </a>
              <a href="https://linkedin.com" className="text-light" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={20} />
              </a>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <h5 className="mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-light text-decoration-none">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/courses" className="text-light text-decoration-none">
                  Courses
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/gallery" className="text-light text-decoration-none">
                  Gallery
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/admission" className="text-light text-decoration-none">
                  Admission
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-light text-decoration-none">
                  Contact Us
                </Link>
              </li>
              {/* Admin Link in Footer */}
              {!user || user.role !== 'admin' ? (
                <li className="mb-2">
                  <Link to="/admin-login" className="text-light text-decoration-none d-flex align-items-center">
                    <FaUserShield className="me-2" />
                    Admin Login
                  </Link>
                </li>
              ) : (
                <li className="mb-2">
                  <Link to="/admin" className="text-light text-decoration-none d-flex align-items-center">
                    <FaUserShield className="me-2" />
                    Admin Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </Col>

          <Col lg={4} md={6}>
            <h5 className="mb-4">Contact Information</h5>
            <ul className="list-unstyled text-light">
              <li className="mb-3 d-flex align-items-start">
                <FaMapMarkerAlt className="me-3 mt-1" />
                <span>
                  123 Medical Street, Healthcare City<br />
                  Tamil Nadu, India - 641001
                </span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaPhone className="me-3" />
                <span>+91 9876543210</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaEnvelope className="me-3" />
                <span>info@nursinginstitute.edu</span>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="my-4 bg-light" />

        <Row className="align-items-center">
          <Col md={6}>
            <p className="mb-0 text-light">
              &copy; {currentYear} Nursing Institute. All rights reserved. <br />
Developed by Nagarajan(MERN stack developer)
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0 text-light">
              Designed with ❤️ for Nursing Education
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;