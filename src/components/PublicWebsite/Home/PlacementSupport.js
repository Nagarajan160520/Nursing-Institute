// src/components/PublicWebsite/Home/PlacementSupport.js
import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { 
  FaBriefcase, 
  FaHandshake, 
  FaChartLine, 
  FaGraduationCap,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaBuilding,
  FaArrowRight
} from 'react-icons/fa';

const PlacementSupport = () => {
  const placementStats = [
    { number: "95%", label: "Placement Rate", icon: <FaChartLine /> },
    { number: "50+", label: "Hospital Partners", icon: <FaHandshake /> },
    { number: "₹3-6 LPA", label: "Average Package", icon: <FaRupeeSign /> },
    { number: "100%", label: "Internship Support", icon: <FaBriefcase /> }
  ];

  const recruitingHospitals = [
    "Apollo Hospitals", "Fortis Healthcare", "Max Hospital", "Medanta", 
    "AIIMS", "Government Medical Colleges", "Columbia Asia", "Manipal Hospitals",
    "Narayana Health", "KIMS", "Care Hospitals", "Global Hospitals"
  ];

  const supportServices = [
    {
      title: "Pre-Placement Training",
      items: ["Resume Building", "Interview Skills", "Communication Training", "Professional Etiquette"]
    },
    {
      title: "Career Guidance",
      items: ["Career Counseling", "Specialization Guidance", "Higher Studies", "Abroad Opportunities"]
    },
    {
      title: "Placement Support",
      items: ["Campus Drives", "Hospital Visits", "Internship Assistance", "Job Portal Access"]
    }
  ];

  return (
    <section className="placement-support py-5">
      <Container>
        <Row className="mb-5 align-items-center">
          <Col lg={6}>
            <h2 className="display-5 fw-bold mb-3">
              Placement & <span style={{ color: '#3498db' }}>Career Support</span>
            </h2>
            <p className="lead text-muted mb-4">
              Comprehensive career support system ensuring 95% placement in top hospitals
            </p>
            <div className="d-flex gap-3">
              <button className="btn btn-primary btn-lg px-4">
                View Placement Records
              </button>
              <button className="btn btn-outline-primary btn-lg">
                Download Brochure
              </button>
            </div>
          </Col>
          
          <Col lg={6}>
            <div className="row g-4">
              {placementStats.map((stat, idx) => (
                <Col key={idx} sm={6}>
                  <div className="text-center p-4 rounded bg-white shadow-sm">
                    <div className="mb-3" style={{ color: '#3498db', fontSize: '30px' }}>
                      {stat.icon}
                    </div>
                    <h3 className="mb-2 fw-bold" style={{ color: '#2c3e50' }}>
                      {stat.number}
                    </h3>
                    <p className="mb-0 text-muted">{stat.label}</p>
                  </div>
                </Col>
              ))}
            </div>
          </Col>
        </Row>

        {/* Recruiting Hospitals */}
        <Row className="mb-5">
          <Col>
            <div className="p-4 rounded bg-light">
              <h4 className="mb-4 text-center">
                <FaBuilding className="me-2" />
                Top Recruiting Hospitals
              </h4>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {recruitingHospitals.map((hospital, idx) => (
                  <Badge 
                    key={idx}
                    className="px-3 py-2 mb-2"
                    style={{ 
                      backgroundColor: 'white',
                      color: '#3498db',
                      border: '1px solid #3498db',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {hospital}
                  </Badge>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* Support Services */}
        <Row className="g-4">
          {supportServices.map((service, idx) => (
            <Col key={idx} lg={4} md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h5 className="mb-4" style={{ color: '#2c3e50' }}>
                    {service.title}
                  </h5>
                  <ul className="list-unstyled">
                    {service.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="mb-3 d-flex align-items-center">
                        <FaArrowRight className="me-3" style={{ color: '#3498db', fontSize: '12px' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default PlacementSupport;