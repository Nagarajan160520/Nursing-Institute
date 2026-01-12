import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaBullseye, FaEye, FaHandsHelping } from 'react-icons/fa';

const MissionVision = () => {
  return (
    <section className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-primary">Our Vision & Mission</h2>
          <p className="lead text-muted">
            Committed to excellence in nursing education and healthcare
          </p>
        </div>

        <Row className="g-4">
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100 text-center">
              <Card.Body className="p-4">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <FaBullseye size={24} />
                </div>
                <Card.Title className="fw-bold">Our Mission</Card.Title>
                <Card.Text>
                  To provide comprehensive nursing education that prepares competent, 
                  compassionate, and ethical nursing professionals committed to excellence 
                  in patient care, research, and community service.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm h-100 text-center">
              <Card.Body className="p-4">
                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <FaEye size={24} />
                </div>
                <Card.Title className="fw-bold">Our Vision</Card.Title>
                <Card.Text>
                  To be a premier institution of nursing education recognized for excellence 
                  in healthcare education, research, and community service, producing leaders 
                  who make a difference in global healthcare.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm h-100 text-center">
              <Card.Body className="p-4">
                <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <FaHandsHelping size={24} />
                </div>
                <Card.Title className="fw-bold">Our Values</Card.Title>
                <Card.Text>
                  <strong>Excellence:</strong> Striving for the highest standards<br/>
                  <strong>Compassion:</strong> Caring with empathy and respect<br/>
                  <strong>Integrity:</strong> Upholding ethical principles<br/>
                  <strong>Innovation:</strong> Embracing new ideas and technologies
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default MissionVision;