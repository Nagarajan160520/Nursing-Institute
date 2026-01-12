import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaBullhorn, FaExclamationTriangle } from 'react-icons/fa';

const AnnouncementTicker = () => {
  const [announcements, setAnnouncements] = useState([
    "Admissions open for 2025-29 batch. Apply now!",
    "Last date for fee payment: 30th November 2024",
    "Annual Sports Day on 15th December 2026",
    "Mid-term exams from 10th to 20th December 2026"
  ]);

  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
    <div className="bg-warning text-dark py-2">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={1} className="text-center">
            <FaBullhorn className="me-2" />
          </Col>
          <Col xs={12} md={10}>
            <div className="text-center">
              <strong>Latest: </strong>
              <span>{announcements[currentAnnouncement]}</span>
            </div>
          </Col>
          <Col xs={12} md={1} className="text-center">
            <FaExclamationTriangle />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AnnouncementTicker;