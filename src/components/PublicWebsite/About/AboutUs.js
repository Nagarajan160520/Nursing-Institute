import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Accordion, Tab, Tabs } from 'react-bootstrap';
import { FaHistory, FaEye, FaBullseye, FaAward, FaUserMd, FaBuilding } from 'react-icons/fa';
import api from '../../../services/api';

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await api.get('/public/about');
      setAboutData(response.data.data);
    } catch (error) {
      // Fallback data if API fails
      setAboutData({
        history: "Our Nursing Institute was established in 1995 with a vision to provide quality nursing education. Over the years, we have trained thousands of nursing professionals who are serving in various healthcare sectors across the country.",
        mission: "To provide comprehensive nursing education that prepares competent, compassionate, and ethical nursing professionals committed to excellence in patient care, research, and community service.",
        vision: "To be a premier institution of nursing education recognized for excellence in healthcare education, research, and community service.",
        values: ["Excellence", "Compassion", "Integrity", "Respect", "Innovation"],
        accreditation: [
          { body: "Indian Nursing Council", status: "Approved" },
          { body: "State Nursing Council", status: "Recognized" },
          { body: "University Grants Commission", status: "Affiliated" }
        ],
        infrastructure: {
          labs: ["Nursing Foundation Lab", "Anatomy & Physiology Lab", "Community Health Lab", "Computer Lab"],
          library: "Well-stocked library with 10,000+ books and digital resources",
          hostel: "Separate hostel facilities for boys and girls with modern amenities",
          transport: "College buses covering all major routes in the city",
          cafeteria: "Hygienic and nutritious food available"
        },
        management: [
          { name: "Dr. R. Sharma", designation: "Principal", qualification: "Ph.D in Nursing", experience: "25 years" },
          { name: "Dr. S. Patel", designation: "Vice Principal", qualification: "M.Sc Nursing", experience: "20 years" }
        ]
      });
    }
  };

  if (!aboutData) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Page Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">About Our Institute</h1>
        <p className="lead text-muted">
          Excellence in Nursing Education Since 1995
        </p>
      </div>

      {/* History Section */}
      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-5">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <FaHistory size={24} />
                </div>
                <div>
                  <h2 className="h3 mb-1">Our History</h2>
                  <p className="text-muted mb-0">Journey of Excellence</p>
                </div>
              </div>
              <p className="fs-5">{aboutData.history}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Mission, Vision, Values */}
      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <FaBullseye size={24} />
                </div>
                <h3 className="h4 mb-2">Our Mission</h3>
              </div>
              <p className="text-center">{aboutData.mission}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <FaEye size={24} />
                </div>
                <h3 className="h4 mb-2">Our Vision</h3>
              </div>
              <p className="text-center">{aboutData.vision}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <FaAward size={24} />
                </div>
                <h3 className="h4 mb-2">Our Values</h3>
              </div>
              <ul className="list-unstyled">
                {aboutData.values.map((value, index) => (
                  <li key={index} className="mb-2">
                    <div className="d-flex align-items-center">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" 
                           style={{ width: '30px', height: '30px' }}>
                        <span className="text-primary fw-bold">{index + 1}</span>
                      </div>
                      <span>{value}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Accreditation & Infrastructure */}
      <Row className="g-4 mb-5">
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <h3 className="h4 mb-4">Accreditation & Approvals</h3>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Accreditation Body</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aboutData.accreditation.map((acc, index) => (
                      <tr key={index}>
                        <td>{acc.body}</td>
                        <td>
                          <span className="badge bg-success">{acc.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <h3 className="h4 mb-4">Infrastructure & Facilities</h3>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <FaBuilding className="me-2" />
                    Labs & Classrooms
                  </Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      {aboutData.infrastructure.labs.map((lab, index) => (
                        <li key={index}>{lab}</li>
                      ))}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Library</Accordion.Header>
                  <Accordion.Body>
                    {aboutData.infrastructure.library}
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Hostel Facilities</Accordion.Header>
                  <Accordion.Body>
                    {aboutData.infrastructure.hostel}
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="3">
                  <Accordion.Header>Transport</Accordion.Header>
                  <Accordion.Body>
                    {aboutData.infrastructure.transport}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Management Team */}
      <Row className="mb-5">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h3 className="h4 mb-4">Management Team</h3>
              <Row>
                {aboutData.management.map((member, index) => (
                  <Col md={6} key={index} className="mb-4">
                    <div className="d-flex align-items-start">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                           style={{ width: '80px', height: '80px' }}>
                        <FaUserMd size={32} />
                      </div>
                      <div>
                        <h4 className="h5 mb-1">{member.name}</h4>
                        <p className="text-primary fw-semibold mb-1">{member.designation}</p>
                        <p className="text-muted mb-1">Qualification: {member.qualification}</p>
                        <p className="text-muted mb-0">Experience: {member.experience}</p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Statistics */}
      <Row className="g-4">
        <Col md={3} className="text-center">
          <div className="p-4 border rounded">
            <h2 className="display-4 fw-bold text-primary mb-2">25+</h2>
            <p className="text-muted mb-0">Years of Excellence</p>
          </div>
        </Col>
        <Col md={3} className="text-center">
          <div className="p-4 border rounded">
            <h2 className="display-4 fw-bold text-primary mb-2">5000+</h2>
            <p className="text-muted mb-0">Students Trained</p>
          </div>
        </Col>
        <Col md={3} className="text-center">
          <div className="p-4 border rounded">
            <h2 className="display-4 fw-bold text-primary mb-2">50+</h2>
            <p className="text-muted mb-0">Expert Faculty</p>
          </div>
        </Col>
        <Col md={3} className="text-center">
          <div className="p-4 border rounded">
            <h2 className="display-4 fw-bold text-primary mb-2">95%</h2>
            <p className="text-muted mb-0">Placement Rate</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default About;