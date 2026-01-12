// src/components/PublicWebsite/Home/FacultySpotlight.js
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { 
  FaUserMd, 
  FaGraduationCap, 
  FaBook, 
  FaAward,
  FaLinkedin,
  FaEnvelope,
  FaQuoteLeft
} from 'react-icons/fa';

const FacultySpotlight = () => {
  const facultyMembers = [
    {
      id: 1,
      name: "Dr. Sunita Sharma",
      designation: "Principal",
      qualification: "Ph.D (Nursing), M.Sc Nursing",
      experience: "25+ Years",
      specialization: "Medical-Surgical Nursing",
      bio: "Published 50+ research papers in national & international journals",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      name: "Prof. Ravi Kumar",
      designation: "Vice Principal",
      qualification: "M.Sc Nursing, B.Sc Nursing",
      experience: "20+ Years",
      specialization: "Community Health Nursing",
      bio: "Expert in community health programs and rural healthcare",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      name: "Dr. Anjali Patel",
      designation: "HOD - Pediatric Nursing",
      qualification: "Ph.D, M.Sc (Pediatric Nursing)",
      experience: "18+ Years",
      specialization: "Pediatric & Neonatal Care",
      bio: "Trained 1000+ nurses in pediatric emergency care",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <section className="faculty-spotlight py-5" style={{ backgroundColor: '#f8fafc' }}>
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <div className="mb-4">
              <FaUserMd size={50} style={{ color: '#3498db' }} />
            </div>
            <h2 className="display-5 fw-bold mb-3">
              Meet Our <span style={{ color: '#3498db' }}>Expert Faculty</span>
            </h2>
            <p className="lead text-muted">
              Learn from experienced nursing professionals with decades of clinical and teaching experience
            </p>
          </Col>
        </Row>

        <Row className="g-4 mb-5">
          {facultyMembers.map((faculty) => (
            <Col key={faculty.id} lg={4} md={6}>
              <Card className="border-0 shadow-sm h-100">
                <div className="text-center pt-4">
                  <img
                    src={faculty.image}
                    alt={faculty.name}
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '4px solid white',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
                <Card.Body className="text-center pt-0">
                  <h5 className="mt-4 mb-2" style={{ color: '#2c3e50' }}>
                    {faculty.name}
                  </h5>
                  <p className="text-primary mb-3 fw-semibold">{faculty.designation}</p>
                  
                  <div className="faculty-details mb-4">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <FaGraduationCap className="me-2" style={{ color: '#3498db' }} />
                      <small>{faculty.qualification}</small>
                    </div>
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <FaAward className="me-2" style={{ color: '#3498db' }} />
                      <small>{faculty.experience} Experience</small>
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                      <FaBook className="me-2" style={{ color: '#3498db' }} />
                      <small>{faculty.specialization}</small>
                    </div>
                  </div>
                  
                  <p className="small text-muted mb-4">
                    <FaQuoteLeft className="me-1" />
                    {faculty.bio}
                  </p>
                  
                  <div className="d-flex justify-content-center gap-2">
                    <Button variant="outline-primary" size="sm">
                      <FaEnvelope /> Contact
                    </Button>
                    <Button variant="outline-info" size="sm">
                      <FaLinkedin /> Profile
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Faculty Stats */}
        <Row className="g-4">
          <Col md={3} sm={6}>
            <div className="text-center p-4 bg-white rounded shadow-sm">
              <h3 className="fw-bold mb-2" style={{ color: '#3498db' }}>25+</h3>
              <p className="mb-0 text-muted">Faculty Members</p>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="text-center p-4 bg-white rounded shadow-sm">
              <h3 className="fw-bold mb-2" style={{ color: '#3498db' }}>15+</h3>
              <p className="mb-0 text-muted">PhD Holders</p>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="text-center p-4 bg-white rounded shadow-sm">
              <h3 className="fw-bold mb-2" style={{ color: '#3498db' }}>200+</h3>
              <p className="mb-0 text-muted">Research Papers</p>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="text-center p-4 bg-white rounded shadow-sm">
              <h3 className="fw-bold mb-2" style={{ color: '#3498db' }}>10+</h3>
              <p className="mb-0 text-muted">Awards Won</p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FacultySpotlight;