import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import api from '../../../services/api';

// Inline styles to ensure layout looks acceptable even if Bootstrap CSS isn't loaded
const styles = {
  section: {
    padding: '2.5rem 0',
    background: '#ffffff'
  },
  header: {
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center'
  },
  cardWrapper: {
    minWidth: 260,
    maxWidth: 360,
    flex: '1 1 300px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#6c757d'
  }
};

const EventsPreview = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      setError('');
      const res = await api.get('/public/events?limit=5');
      if (res && res.data && res.data.data && res.data.data.length > 0) {
        setEvents(res.data.data || []);
        setError('');
      } else {
        // Fallback: try fetching homepage payload which may include events
        try {
          const homeRes = await api.get('/public/home');
          if (homeRes && homeRes.data && homeRes.data.data && homeRes.data.data.events && homeRes.data.data.events.length > 0) {
            setEvents(homeRes.data.data.events || []);
            setError('');
          } else {
            setEvents([]);
            setError('No events available');
          }
        } catch (homeErr) {
          console.error('Fallback to /public/home failed', homeErr);
          setEvents([]);
          setError('Failed to load events');
        }
      }
    } catch (err) {
      console.error('Failed to fetch public events', err);
      // Attempt fallback to /public/home if /public/events fails
      try {
        const homeRes = await api.get('/public/home');
        if (homeRes && homeRes.data && homeRes.data.data && homeRes.data.data.events && homeRes.data.data.events.length > 0) {
          setEvents(homeRes.data.data.events || []);
          setError('');
        } else {
          setEvents([]);
          setError(err.response?.data?.message || 'Failed to load events');
        }
      } catch (homeErr) {
        console.error('Fallback to /public/home failed', homeErr);
        setEvents([]);
        setError(err.response?.data?.message || 'Failed to load events');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="events-preview py-4">
      <h3 style={styles.header}>Upcoming Events</h3>
      {error && (
        <div style={styles.emptyState}>
          <p>{error}</p>
          <Button variant="outline-primary" onClick={fetchEvents}>Retry</Button>
        </div>
      )}

      {!error && (
        <div style={styles.grid}>
          {events.length === 0 && !loading && (
            <div style={styles.emptyState}><p>No upcoming events right now.</p></div>
          )}

          {events.map(event => (
            <div key={event._id} style={styles.cardWrapper}>
              <Card className="h-100 shadow-sm" style={{ minHeight: 170 }}>
                <Card.Body>
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{new Date(event.startDate).toLocaleDateString()}</Card.Subtitle>
                  <Card.Text className="small text-truncate" style={{ maxHeight: 48, overflow: 'hidden' }}>{event.description}</Card.Text>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <small className="text-muted">{event.venue}</small>
                      <Button size="sm" href={event.slug ? `/events/${event.slug}` : `/events/${event._id}`} variant="outline-primary">View</Button>
                  </div>
                </Card.Body>
              </Card>
            </div> 
          ))}
        </div>
      )}
    </div>
  ); 
};

export default EventsPreview;
