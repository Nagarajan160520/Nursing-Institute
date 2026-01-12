import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaBullhorn, FaTimes } from 'react-icons/fa';
import api from '../../../services/api';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/news/recent');
      if (response.data.data && response.data.data.length > 0) {
        setAnnouncements(response.data.data);
      }
    } catch (error) {
      // Use default announcements if API fails
      setAnnouncements([
        { title: 'Admissions Open for 2026-2029 Batch!', category: 'Admission' },
        { title: 'Last Date for Fee Submission: 31st Jan', category: 'Important' },
        { title: 'Annual Sports Day on 15th February', category: 'Event' }
      ]);
    }
  };

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [announcements.length]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Important': return 'danger';
      case 'Admission': return 'success';
      case 'Exam': return 'warning';
      case 'Event': return 'info';
      default: return 'primary';
    }
  };

  return (
    <div className="announcement-bar bg-primary text-white">
      <Container className="py-2">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <FaBullhorn className="me-3" />
            <div className="announcement-content">
              <span className={`badge bg-${getCategoryColor(currentAnnouncement.category)} me-2`}>
                {currentAnnouncement.category}
              </span>
              <span className="announcement-text">
                {currentAnnouncement.title}
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            {announcements.length > 1 && (
              <div className="announcement-dots">
                {announcements.map((_, index) => (
                  <button
                    key={index}
                    className={`announcement-dot ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to announcement ${index + 1}`}
                  />
                ))}
              </div>
            )}
            <Button
              variant="link"
              className="text-white p-0"
              onClick={handleClose}
              aria-label="Close announcement"
            >
              <FaTimes />
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AnnouncementBar;