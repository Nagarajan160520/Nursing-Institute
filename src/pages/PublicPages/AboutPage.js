import React from 'react';
import { Container, Row, Col, Card, Tab, Tabs } from 'react-bootstrap';
import { 
  FaHistory, 
  FaBullseye, 
  FaEye, 
  FaAward, 
  FaUserTie, 
  FaBuilding 
} from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white">
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">About Our Institute</h1>
              <p className="lead mb-4">
                Established in 1995, we have been at the forefront of nursing education, 
                producing thousands of healthcare professionals who serve across the globe.
              </p>
            </Col>
            <Col lg={6}>
              <img 
                src="https://i.pinimg.com/736x/53/df/8b/53df8b6293fd360c1a5556644c18ea6a.jpg"
                //src="/images/about-hero.jpg" 
                alt="About Nursing Institute" 
                className="img-fluid rounded shadow-lg"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Tabs Section */}
      <section className="py-5 bg-white">
        <Container>
          <Tabs defaultActiveKey="history" className="mb-4">
            <Tab eventKey="history" title={
              <span className="d-flex align-items-center">
                <FaHistory className="me-2" />
                History
              </span>
            }>
              <Row className="py-4">
                <Col lg={6}>
                  <h3 className="mb-4">Our Journey</h3>
                  <p className="lead">
                    Founded with a vision to revolutionize nursing education in India
                  </p>
                  <p>
                    Nursing Institute was established in 1995 by a group of dedicated 
                    healthcare professionals and educators. What started as a small 
                    institution with just 50 students has now grown into a premier 
                    nursing education center with state-of-the-art facilities.
                  </p>
                  <p>
                    Over the years, we have continuously evolved our curriculum to 
                    meet international standards while maintaining our commitment to 
                    providing quality education accessible to all sections of society.
                  </p>
                </Col>
                <Col lg={6}>
                  <div className="timeline">
                    <div className="timeline-item">
                      <div className="timeline-year">1995</div>
                      <div className="timeline-content">
                        <h5>Institute Founded</h5>
                        <p>Started with GNM and ANM courses</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-year">2005</div>
                      <div className="timeline-content">
                        <h5>Expansion</h5>
                        <p>Introduced B.Sc Nursing program</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-year">2015</div>
                      <div className="timeline-content">
                        <h5>Recognition</h5>
                        <p>Awarded 'Best Nursing Institute' by State Government</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-year">2023</div>
                      <div className="timeline-content">
                        <h5>Digital Transformation</h5>
                        <p>Complete digital infrastructure and e-learning platform</p>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="mission" title={
              <span className="d-flex align-items-center">
                <FaBullseye className="me-2" />
                Mission & Vision
              </span>
            }>
              <Row className="py-4">
                <Col md={6} className="mb-4">
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="p-4">
                      <div className="text-center mb-4">
                        <FaBullseye size={40} className="text-primary" />
                      </div>
                      <h3 className="text-center mb-4">Our Mission</h3>
                      <p className="text-center">
                        To provide comprehensive nursing education that prepares competent, 
                        compassionate, and ethical nursing professionals committed to 
                        excellence in patient care, research, and community service.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="p-4">
                      <div className="text-center mb-4">
                        <FaEye size={40} className="text-success" />
                      </div>
                      <h3 className="text-center mb-4">Our Vision</h3>
                      <p className="text-center">
                        To be a premier institution of nursing education recognized for 
                        excellence in healthcare education, research, and community service, 
                        producing leaders who make a difference in global healthcare.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="accreditation" title={
              <span className="d-flex align-items-center">
                <FaAward className="me-2" />
                Accreditation
              </span>
            }>
              <Row className="py-4">
                <Col>
                  <h3 className="mb-4">Recognitions & Approvals</h3>
                  <Row className="g-4">
                    <Col md={4}>
                      <Card className="text-center border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                          <FaAward size={50} className="text-warning mb-3" />
                          <h5>Indian Nursing Council</h5>
                          <p className="text-muted">Approved by INC</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="text-center border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                          <FaAward size={50} className="text-info mb-3" />
                          <h5>State Nursing Council</h5>
                          <p className="text-muted">Recognized by SNC</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="text-center border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                          <FaAward size={50} className="text-success mb-3" />
                          <h5>University Affiliation</h5>
                          <p className="text-muted">Affiliated to University</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="leadership" title={
              <span className="d-flex align-items-center">
                <FaUserTie className="me-2" />
                Leadership
              </span>
            }>
              <Row className="py-4">
                <Col>
                  <h3 className="mb-4">Our Leadership Team</h3>
                  <Row className="g-4">
                    <Col lg={4} md={6}>
                      <Card className="text-center border-0 shadow-sm">
                        <Card.Body className="p-4">
                          <img 
                            src="/images/principal.jpg" 
                            alt="Principal" 
                            className="rounded-circle mb-3"
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                          />
                          <h5>Dr. R. Sharma</h5>
                          <p className="text-muted">Principal</p>
                          <p className="small">
                            25+ years of experience in nursing education
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={4} md={6}>
                      <Card className="text-center border-0 shadow-sm">
                        <Card.Body className="p-4">
                          <img 
                            src="/images/vice-principal.jpg" 
                            alt="Vice Principal" 
                            className="rounded-circle mb-3"
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                          />
                          <h5>Dr. S. Patel</h5>
                          <p className="text-muted">Vice Principal</p>
                          <p className="small">
                            20+ years of clinical and teaching experience
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={4} md={6}>
                      <Card className="text-center border-0 shadow-sm">
                        <Card.Body className="p-4">
                          <img 
                            src="/images/director.jpg" 
                            alt="Director" 
                            className="rounded-circle mb-3"
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                          />
                          <h5>Mr. K. Singh</h5>
                          <p className="text-muted">Director</p>
                          <p className="small">
                            Healthcare management expert with 30+ years experience
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="infrastructure" title={
              <span className="d-flex align-items-center">
                <FaBuilding className="me-2" />
                Infrastructure
              </span>
            }>
              <Row className="py-4">
                <Col>
                  <h3 className="mb-4">Our Facilities</h3>
                  <Row className="g-4">
                    <Col md={4}>
                      <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                          <h5>Advanced Labs</h5>
                          <ul className="list-unstyled">
                            <li>• Nursing Foundation Lab</li>
                            <li>• Anatomy & Physiology Lab</li>
                            <li>• Community Health Lab</li>
                            <li>• Computer Lab</li>
                            <li>• Simulation Lab</li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                          <h5>Campus Facilities</h5>
                          <ul className="list-unstyled">
                            <li>• Digital Library with 10,000+ Books</li>
                            <li>• Separate Hostels (Boys & Girls)</li>
                            <li>• Cafeteria with Nutritious Food</li>
                            <li>• Sports Complex</li>
                            <li>• Auditorium</li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                          <h5>Clinical Training</h5>
                          <ul className="list-unstyled">
                            <li>• Tie-ups with 15+ Hospitals</li>
                            <li>• 1200+ Clinical Training Hours</li>
                            <li>• Specialized Departments</li>
                            <li>• Expert Clinical Instructors</li>
                            <li>• Community Health Programs</li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Container>
      </section>

      <style jsx>{`
        .hero-section {
          background: linear-gradient(rgba(44, 62, 80, 0.9), rgba(44, 62, 80, 0.8)), 
                      url('/images/about-bg.jpg') center/cover no-repeat;
        }
        
        .timeline {
          position: relative;
          padding-left: 30px;
        }
        
        .timeline::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #3498db;
        }
        
        .timeline-item {
          position: relative;
          margin-bottom: 30px;
        }
        
        .timeline-item::before {
          content: '';
          position: absolute;
          left: -36px;
          top: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3498db;
        }
        
        .timeline-year {
          position: absolute;
          left: -100px;
          top: -5px;
          background: #3498db;
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-weight: bold;
        }
        
        .timeline-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        @media (max-width: 768px) {
          .timeline-year {
            position: relative;
            left: 0;
            display: inline-block;
            margin-bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;