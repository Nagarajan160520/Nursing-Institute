import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Spinner } from 'react-bootstrap';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const ClinicalSchedule = () => {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const [weekly, setWeekly] = useState({});

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await api.get('/student/clinical-schedule');
      const data = res.data.data || {};
      setSchedule(data.schedule || []);
      setWeekly(data.weeklySchedule || {});
    } catch (err) {
      console.error('Fetch clinical schedule error', err);
      toast.error('Failed to load clinical schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading clinical schedule...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h3 className="mb-4">Clinical Schedule</h3>
      {Object.keys(weekly).length > 0 ? (
        Object.keys(weekly).map(weekKey => {
          const week = weekly[weekKey];
          return (
            <Card className="mb-3" key={weekKey}>
              <Card.Body>
                <h5>Week of {new Date(week.weekStart).toLocaleDateString()}</h5>
                <ListGroup variant="flush">
                  {week.postings.map((p) => (
                    <ListGroup.Item key={p._id} className="d-flex justify-content-between align-items-start">
                      <div>
                        <strong>{p.subject || 'Clinical'}</strong>
                        <div className="small text-muted">{new Date(p.date).toLocaleDateString()} • {p.type}</div>
                        <div className="small">{p.notes}</div>
                      </div>
                      <div className="text-end small text-muted">Taken by {p.recordedBy?.username || 'staff'}</div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <p className="text-muted">No clinical postings for this period.</p>
      )}
    </Container>
  );
};

export default ClinicalSchedule;
