import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const defaultForm = {
  title: '',
  message: '',
  type: 'info',
  category: 'General',
  priority: 'medium',
  targetType: 'all',
  targetIds: [],
  sendMethod: ['dashboard'],
  isActive: true
};

const NotificationManager = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/notifications');
      setNotifications(res.data.data.notifications || []);
    } catch (err) {
      console.error('Fetch admin notifications error', err);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (n) => {
    setEditing(n);
    setForm({ ...n });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!form.title || !form.message) return toast.error('Title and message required');
      if (editing) {
        const res = await api.put(`/admin/notifications/${editing._id}`, form);
        toast.success('Notification updated');
      } else {
        const res = await api.post('/admin/notifications', form);
        toast.success('Notification created');
      }
      setShowModal(false);
      fetchNotifications();
    } catch (err) {
      console.error('Save notification error', err);
      toast.error('Failed to save notification');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      await api.delete(`/admin/notifications/${id}`);
      toast.success('Notification deleted');
      fetchNotifications();
    } catch (err) {
      console.error('Delete error', err);
      toast.error('Failed to delete');
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h3>Notifications</h3>
        </Col>
        <Col className="text-end">
          <Button onClick={openCreate}>Create Notification</Button>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {notifications.map(n => (
                <tr key={n._id}>
                  <td>{n.title}</td>
                  <td>{n.category}</td>
                  <td>{n.priority}</td>
                  <td>{n.isActive ? 'Active' : 'Inactive'}</td>
                  <td>{new Date(n.createdAt).toLocaleString()}</td>
                  <td className="text-end">
                    <Button size="sm" variant="outline-primary" className="me-2" onClick={() => openEdit(n)}>Edit</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(n._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Edit' : 'Create'} Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </Form.Group>

            <Row className="gy-2">
              <Col>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option>General</option>
                    <option>Academic</option>
                    <option>Administrative</option>
                    <option>Event</option>
                    <option>Exam</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Priority</Form.Label>
                  <Form.Select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="gy-2 mt-2">
              <Col>
                <Form.Group>
                  <Form.Label>Target Type</Form.Label>
                  <Form.Select value={form.targetType} onChange={e => setForm({ ...form, targetType: e.target.value })}>
                    <option value="all">All</option>
                    <option value="course">Course</option>
                    <option value="individual">Individual</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Check type="checkbox" label="Active" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                </Form.Group>
              </Col>
            </Row>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>{editing ? 'Save' : 'Create'}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default NotificationManager;
