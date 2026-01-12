import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { FaEnvelope, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import api from '../../../services/api';

const ContactStatsWidget = () => {
  const [stats, setStats] = useState({
    newContacts: 0,
    totalContacts: 0,
    avgResponseTime: 0
  });

  useEffect(() => {
    fetchContactStats();
  }, []);

  const fetchContactStats = async () => {
    try {
      const response = await api.get('/admin/contacts/stats');
      const data = response.data.data;
      
      setStats({
        newContacts: data.summary?.new || 0,
        totalContacts: data.summary?.total || 0,
        avgResponseTime: data.responseTime?.avgResponseTime || 0
      });
    } catch (error) {
      console.error('Failed to fetch contact stats:', error);
    }
  };

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="card-title mb-0">Contact Messages</h6>
          <Badge bg={stats.newContacts > 0 ? 'danger' : 'success'} pill>
            {stats.newContacts} new
          </Badge>
        </div>
        
        <Row className="g-2">
          <Col xs={12}>
            <div className="d-flex align-items-center p-2 bg-light rounded">
              <FaEnvelope className="text-primary me-3" />
              <div>
                <h6 className="mb-0">{stats.totalContacts}</h6>
                <small className="text-muted">Total Messages</small>
              </div>
            </div>
          </Col>
          
          <Col xs={12}>
            <div className="d-flex align-items-center p-2 bg-light rounded">
              <FaClock className="text-warning me-3" />
              <div>
                <h6 className="mb-0">{stats.avgResponseTime.toFixed(1)}h</h6>
                <small className="text-muted">Avg Response Time</small>
              </div>
            </div>
          </Col>
          
          {stats.newContacts > 0 && (
            <Col xs={12}>
              <div className="alert alert-warning py-2 mb-0">
                <FaExclamationTriangle className="me-2" />
                <small>{stats.newContacts} new messages need attention</small>
              </div>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ContactStatsWidget;