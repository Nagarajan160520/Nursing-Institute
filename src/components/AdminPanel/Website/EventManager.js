import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge } from 'react-bootstrap';
import { FaCalendarAlt, FaEdit, FaTrash, FaPlus, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    eventType: 'Academic',
    category: 'Other',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    venue: '',
    registrationRequired: false,
    maxParticipants: 0,
    isPublished: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/admin/events');
      setEvents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = { ...eventForm };
      
      // Convert date strings to proper format
      if (formData.startDate) {
        formData.startDate = new Date(formData.startDate).toISOString();
      }
      if (formData.endDate) {
        formData.endDate = new Date(formData.endDate).toISOString();
      }

      if (editingEvent) {
        await api.put(`/admin/events/${editingEvent._id}`, formData);
        toast.success('Event updated successfully');
      } else {
        await api.post('/admin/events', formData);
        toast.success('Event created successfully');
      }

      setShowModal(false);
      setEditingEvent(null);
      setEventForm({
        title: '',
        description: '',
        eventType: 'Academic',
        category: 'Other',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        venue: '',
        registrationRequired: false,
        maxParticipants: 0,
        isPublished: true
      });
      
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/admin/events/${id}`);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      category: event.category,
      startDate: event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      venue: event.venue,
      registrationRequired: event.registrationRequired || false,
      maxParticipants: event.maxParticipants || 0,
      isPublished: event.isPublished
    });
    setShowModal(true);
  };

  const getStatusBadge = (event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (now > endDate) return <Badge bg="secondary">Completed</Badge>;
    if (now >= startDate && now <= endDate) return <Badge bg="success">Ongoing</Badge>;
    if (startDate > now) return <Badge bg="primary">Upcoming</Badge>;
    return <Badge bg="warning">Unknown</Badge>;
  };

  if (loading && events.length === 0) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0">Event Management</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" />
          Add New Event
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Event</th>
                <th>Type</th>
                <th>Date & Time</th>
                <th>Venue</th>
                <th>Status</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={event._id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{event.title}</strong>
                    <div className="small text-muted">{event.category}</div>
                  </td>
                  <td>
                    <Badge bg="info">{event.eventType}</Badge>
                  </td>
                  <td>
                    <div className="small">
                      <div><FaClock className="me-1" /> {new Date(event.startDate).toLocaleDateString()}</div>
                      {event.startTime && (
                        <div className="text-muted">{event.startTime} - {event.endTime}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="small">
                      <FaMapMarkerAlt className="me-1" />
                      {event.venue}
                    </div>
                  </td>
                  <td>{getStatusBadge(event)}</td>
                  <td>
                    <Badge bg={event.isPublished ? 'success' : 'warning'}>
                      {event.isPublished ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <Button variant="outline-primary" onClick={() => handleEdit(event)}>
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" onClick={() => handleDelete(event._id)}>
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {events.length === 0 && (
            <div className="text-center py-5">
              <FaCalendarAlt size={48} className="text-muted mb-3" />
              <h5>No Events Found</h5>
              <p className="text-muted">Click "Add New Event" to create your first event.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Event Modal */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setEditingEvent(null);
        setEventForm({
          title: '',
          description: '',
          eventType: 'Academic',
          category: 'Other',
          startDate: '',
          endDate: '',
          startTime: '',
          endTime: '',
          venue: '',
          registrationRequired: false,
          maxParticipants: 0,
          isPublished: true
        });
      }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingEvent ? 'Edit Event' : 'Add New Event'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Type</Form.Label>
                  <Form.Select
                    value={eventForm.eventType}
                    onChange={(e) => setEventForm({...eventForm, eventType: e.target.value})}
                  >
                    <option value="Academic">Academic</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Conference">Conference</option>
                    <option value="Celebration">Celebration</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={eventForm.startDate}
                    onChange={(e) => setEventForm({...eventForm, startDate: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={eventForm.endDate}
                    onChange={(e) => setEventForm({...eventForm, endDate: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={eventForm.startTime}
                    onChange={(e) => setEventForm({...eventForm, startTime: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={eventForm.endTime}
                    onChange={(e) => setEventForm({...eventForm, endTime: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Venue *</Form.Label>
              <Form.Control
                type="text"
                value={eventForm.venue}
                onChange={(e) => setEventForm({...eventForm, venue: e.target.value})}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Registration Required"
                    checked={eventForm.registrationRequired}
                    onChange={(e) => setEventForm({...eventForm, registrationRequired: e.target.checked})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                {eventForm.registrationRequired && (
                  <Form.Group className="mb-3">
                    <Form.Label>Max Participants</Form.Label>
                    <Form.Control
                      type="number"
                      value={eventForm.maxParticipants}
                      onChange={(e) => setEventForm({...eventForm, maxParticipants: parseInt(e.target.value) || 0})}
                    />
                  </Form.Group>
                )}
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Publish Event"
                checked={eventForm.isPublished}
                onChange={(e) => setEventForm({...eventForm, isPublished: e.target.checked})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default EventManager;