import React, { useState } from 'react';
import { Container, Card, ListGroup, Button, Spinner } from 'react-bootstrap';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import useAutoRefresh from '../../../hooks/useAutoRefresh';

const StudentNotifications = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/student/notifications');
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error('Fetch notifications error', err);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh notifications and refetch when tab is visible (staggered by jitter)
  useAutoRefresh(fetchNotifications, 60000);

  const markAsRead = async (id) => {
    try {
      await api.put(`/student/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, readBy: [...(n.readBy || []), 'me'] } : n));
      toast.success('Marked as read');
    } catch (err) {
      console.error('Mark read error', err);
      toast.error('Failed to mark as read');
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading notifications...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h3 className="mb-4">Notifications</h3>
      {notifications.length > 0 ? (
        <ListGroup>
          {notifications.map(n => (
            <ListGroup.Item key={n._id} className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="mb-1">{n.title}</h6>
                <p className="small text-muted mb-1">{n.message}</p>
                <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
              </div>
              <div className="text-end">
                {!n.readBy || n.readBy.length === 0 ? (
                  <Button size="sm" onClick={() => markAsRead(n._id)}>Mark read</Button>
                ) : (
                  <small className="text-success">Read</small>
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted">No notifications</p>
      )}
    </Container>
  );
};

export default StudentNotifications;
