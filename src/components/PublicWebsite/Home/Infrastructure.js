import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { 
  FaBuilding, 
  FaFlask, 
  FaBook, 
  FaBed, 
  FaBus, 
  FaHospital, 
  FaVideo, 
  FaWifi,
  FaFootballBall,
  FaUsers,
  FaArrowRight,
  FaCheckCircle,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Infrastructure = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const facilities = [
    {
      id: 1,
      title: "Modern Nursing Labs",
      icon: <FaFlask />,
      description: "State-of-the-art nursing simulation labs with advanced medical equipment",
      features: [
        "Simulation Mannequins",
        "ICU Setup",
        "Operation Theatre",
        "Pediatric Care Lab",
        "Community Health Lab"
      ],
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      color: "#3498db"
    },
    {
      id: 2,
      title: "Anatomy & Physiology Lab",
      icon: <FaHospital />,
      description: "Well-equipped lab with anatomical models, charts, and specimens",
      features: [
        "Human Skeletons",
        "Anatomical Models",
        "Microscopes",
        "Charts & Specimens",
        "Digital Learning Tools"
      ],
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      color: "#e74c3c"
    },
    {
      id: 3,
      title: "Digital Library",
      icon: <FaBook />,
      description: "Fully-stacked library with digital resources and reading rooms",
      features: [
        "10,000+ Books",
        "E-Journals Access",
        "Digital Database",
        "Reading Rooms",
        "Computer Section"
      ],
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      color: "#2ecc71"
    },
    {
      id: 4,
      title: "Hostel Facilities",
      icon: <FaBed />,
      description: "Separate hostel facilities with modern amenities for boys and girls",
      features: [
        "AC & Non-AC Rooms",
        "24/7 Security",
        "WiFi Connectivity",
        "Mess Facility",
        "Recreation Rooms"
      ],
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      color: "#f39c12"
    },
    {
      id: 5,
      title: "Transportation",
      icon: <FaBus />,
      description: "College buses covering all major routes in the city",
      features: [
        "GPS Enabled Buses",
        "Pick-up Points",
        "Female Attendants",
        "Regular Service",
        "Safe & Comfortable"
      ],
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      color: "#9b59b6"
    },
    {
      id: 6,
      title: "Smart Classrooms",
      icon: <FaVideo />,
      description: "Technology-enabled classrooms with audio-visual teaching aids",
      features: [
        "Smart Boards",
        "Projectors",
        "Audio Systems",
        "Air Conditioned",
        "Spacious Seating"
      ],
      image: "https://i.pinimg.com/1200x/1d/80/67/1d8067f2cdd4f6c2b6226bab0af6c108.jpg",
      color: "#1abc9c"
    }
  ];

  const handleFacilityClick = (facility) => {
    setSelectedFacility(facility);
    setShowModal(true);
  };

  return (
    <section className="infrastructure-section py-5">
      {/* Section Header */}
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <div 
              className="section-icon mb-4"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderRadius: '50%',
                marginBottom: '20px'
              }}
            >
              <FaBuilding size={40} style={{ color: '#3498db' }} />
            </div>
            <h2 
              className="display-5 fw-bold mb-3"
              style={{ color: '#2c3e50' }}
            >
              Our <span style={{ color: '#3498db' }}>Infrastructure</span>
            </h2>
            <p 
              className="lead text-muted mb-4"
              style={{ maxWidth: '700px', margin: '0 auto' }}
            >
              State-of-the-art facilities designed to provide the best learning environment for aspiring nursing professionals
            </p>
          </Col>
        </Row>

        {/* Facilities Grid */}
        <Row className="g-4">
          {facilities.map((facility) => (
            <Col key={facility.id} lg={4} md={6}>
              <div 
                className="facility-card h-100"
                onClick={() => handleFacilityClick(facility)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  borderTop: `4px solid ${facility.color}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
                }}
              >
                {/* Card Image */}
                <div 
                  className="facility-image"
                  style={{
                    height: '200px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <img
                    src={facility.image}
                    alt={facility.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                  <div 
                    className="facility-icon-overlay"
                    style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
                    }}
                  >
                    <div style={{ color: facility.color, fontSize: '24px' }}>
                      {facility.icon}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h5 
                    className="mb-3"
                    style={{ 
                      color: '#2c3e50',
                      fontWeight: '600',
                      fontSize: '1.25rem'
                    }}
                  >
                    {facility.title}
                  </h5>
                  <p 
                    className="text-muted mb-3"
                    style={{ lineHeight: '1.6' }}
                  >
                    {facility.description}
                  </p>
                  
                  <div className="mb-3">
                    <div 
                      className="d-flex align-items-center mb-2"
                      style={{ fontSize: '14px' }}
                    >
                      <FaCheckCircle 
                        className="me-2" 
                        style={{ color: facility.color, fontSize: '16px' }} 
                      />
                      <span>{facility.features[0]}</span>
                    </div>
                    <div 
                      className="d-flex align-items-center mb-2"
                      style={{ fontSize: '14px' }}
                    >
                      <FaCheckCircle 
                        className="me-2" 
                        style={{ color: facility.color, fontSize: '16px' }} 
                      />
                      <span>{facility.features[1]}</span>
                    </div>
                  </div>

                  <div 
                    className="d-flex align-items-center mt-4 pt-3"
                    style={{ 
                      borderTop: '1px solid #eee',
                      color: facility.color,
                      fontWeight: '600'
                    }}
                  >
                    <span>View Details</span>
                    <FaArrowRight className="ms-2" />
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Additional Facilities Section */}
        <Row className="mt-5 pt-5">
          <Col>
            <div 
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '15px',
                padding: '40px'
              }}
            >
              <h3 
                className="text-center mb-4"
                style={{ color: '#2c3e50' }}
              >
                Additional Campus Facilities
              </h3>
              <Row className="g-4">
                {[
                  { icon: <FaWifi />, title: 'High-Speed WiFi', desc: 'Campus-wide internet connectivity' },
                  { icon: <FaFootballBall />, title: 'Sports Complex', desc: 'Indoor & outdoor sports facilities' },
                  { icon: <FaUsers />, title: 'Auditorium', desc: '500-seat capacity for events' },
                  { icon: <FaMapMarkerAlt />, title: 'Cafeteria', desc: 'Hygienic food & beverage services' }
                ].map((item, idx) => (
                  <Col key={idx} md={3} sm={6}>
                    <div 
                      className="text-center p-4"
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        height: '100%',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div 
                        className="mb-3"
                        style={{
                          color: '#3498db',
                          fontSize: '32px'
                        }}
                      >
                        {item.icon}
                      </div>
                      <h6 
                        className="mb-2"
                        style={{ color: '#2c3e50' }}
                      >
                        {item.title}
                      </h6>
                      <p 
                        className="small text-muted mb-0"
                      >
                        {item.desc}
                      </p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>

        {/* CTA Section */}
        <Row className="mt-5">
          <Col>
            <div 
              className="text-center p-5 rounded"
              style={{
                background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                color: 'white'
              }}
            >
              <h3 className="mb-3">Want to See Our Campus?</h3>
              <p className="mb-4" style={{ opacity: 0.9 }}>
                Schedule a campus tour to experience our infrastructure firsthand
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button 
                  variant="light" 
                  size="lg"
                  className="fw-bold px-4"
                  onClick={() => window.location.href = '/contact'}
                >
                  Schedule Campus Tour
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg"
                  onClick={() => window.location.href = '/gallery'}
                >
                  View Photo Gallery
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Facility Detail Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg"
        centered
      >
        {selectedFacility && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedFacility.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <img
                    src={selectedFacility.image}
                    alt={selectedFacility.title}
                    className="img-fluid rounded mb-3"
                    style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                  />
                  <div 
                    className="d-flex align-items-center mb-3"
                    style={{ color: selectedFacility.color }}
                  >
                    <div style={{ fontSize: '24px', marginRight: '10px' }}>
                      {selectedFacility.icon}
                    </div>
                    <h5 className="mb-0">Key Features</h5>
                  </div>
                </Col>
                <Col md={6}>
                  <h5 className="mb-3">Description</h5>
                  <p className="text-muted mb-4">
                    {selectedFacility.description}
                  </p>
                  
                  <h5 className="mb-3">Features Include:</h5>
                  <ul className="list-unstyled">
                    {selectedFacility.features.map((feature, idx) => (
                      <li key={idx} className="mb-2">
                        <FaCheckCircle 
                          className="me-2" 
                          style={{ color: selectedFacility.color }} 
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                    <p className="mb-0 small">
                      <strong>Note:</strong> All facilities are regularly maintained and upgraded to meet the latest standards in nursing education.
                    </p>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button 
                variant="primary" 
                onClick={() => window.location.href = '/contact'}
              >
                Schedule Visit
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Inline CSS for the section */}
      <style jsx="true">{`
        .infrastructure-section {
          background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
          position: relative;
        }
        
        .infrastructure-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #3498db, #2ecc71, #f39c12);
        }
        
        .facility-card:hover .facility-image img {
          transform: scale(1.05);
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .section-icon {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Infrastructure;