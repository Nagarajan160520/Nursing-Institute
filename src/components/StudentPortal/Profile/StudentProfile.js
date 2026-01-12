import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Image, Spinner } from 'react-bootstrap';
import { FaUser, FaSave, FaEdit } from 'react-icons/fa';
import api from '../../../services/api';
import useAutoRefresh from '../../../hooks/useAutoRefresh';
import toast from 'react-hot-toast';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    contactNumber: '',
    alternateContact: '',
    address: '',
    guardianDetails: ''
  });
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fetchProfile = async (isInitialLoad = false) => {
    if (fetching) {
      console.log('Already fetching, skipping...');
      return;
    }

    try {
      console.log('Starting fetchProfile...', isInitialLoad ? '(initial load)' : '(refresh)');
      setFetching(true);

      if (isInitialLoad) {
        setLoading(true);
      }

      // Abort if the request takes too long (10s) to avoid leaving the UI stuck
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      console.log('Making API call to /student/profile...');
      const res = await api.get('/student/profile', { signal: controller.signal });
      clearTimeout(timeoutId);

      console.log('API call successful, response:', res);
      console.log('Response data:', res.data);

      if (res.data?.success) {
        console.log('Setting student data...');
        setStudent(res.data.data);
        setForm({
          contactNumber: res.data.data.contactNumber || '',
          alternateContact: res.data.data.alternateContact || '',
          address: res.data.data.address || '',
          guardianDetails: res.data.data.guardianDetails || ''
        });
      } else {
        console.log('API returned success=false');
        // Backend responded but indicated failure
        toast.error(res.data?.message || 'Failed to load profile');
        setStudent(null);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      console.error('Error name:', error?.name);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
      console.error('Error response:', error?.response);

      // Detect cancelled/aborted requests and show an appropriate message
      if (
        error?.name === 'CanceledError' ||
        error?.code === 'ERR_CANCELED' ||
        (error?.message && error.message.toLowerCase().includes('canceled')) ||
        (error?.message && error.message.toLowerCase().includes('timeout'))
      ) {
        toast.error('Profile request timed out. Please try again.');
        console.error('Profile request timed out:', error);
      } else {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      }
    } finally {
      console.log('Finally block: Setting loading to false');
      setFetching(false);
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  // Fetch immediately on mount to avoid loading delay
  useEffect(() => {
    fetchProfile(true);
  }, []);

  // Auto-refresh profile every 5 minutes (profile data doesn't change frequently)
  useAutoRefresh(() => fetchProfile(false), 300000);

  useEffect(() => {
    const handler = () => fetchProfile(false);
    window.addEventListener('realtime:profile', handler);
    return () => window.removeEventListener('realtime:profile', handler);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        contactNumber: form.contactNumber?.trim(),
        alternateContact: form.alternateContact?.trim(),
        address: form.address?.trim(),
        guardianDetails: form.guardianDetails?.trim(),
      };

      // basic validation
      if (!payload.contactNumber) {
        toast.error('Contact number is required');
        setSaving(false);
        return;
      }

      const res = await api.put('/student/profile', payload);
      if (res.data?.success) {
        toast.success('Profile updated');
        setStudent(res.data.data);
        setForm({
          contactNumber: res.data.data.contactNumber || '',
          alternateContact: res.data.data.alternateContact || '',
          address: res.data.data.address || '',
          guardianDetails: res.data.data.guardianDetails || ''
        });
        setEditing(false);
      } else {
        toast.error(res.data?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error.message);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Allow pressing Enter to save while editing
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter' && editing && !saving) {
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [editing, saving, form]);

  if (loading) {
    return (
      <Container fluid className="py-3">
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading profile...</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid className="py-3">
      <Row className="g-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <Image src={student?.profileImage || '/uploads/profile/default.jpg'} roundedCircle width={140} height={140} />
              <h5 className="mt-3">{student?.fullName}</h5>
              <p className="text-muted mb-1">{student?.studentId}</p>
              <p className="text-muted">{student?.courseEnrolled?.courseName || 'N/A'}</p>
              <Button variant={editing ? 'secondary' : 'outline-primary'} onClick={() => setEditing(prev => !prev)} className="mt-3">
                {editing ? <><FaEdit className="me-2"/>Cancel</> : <><FaEdit className="me-2"/>Edit Profile</>}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Profile Details</h5>
              {!editing && <small className="text-muted">Last updated: {new Date(student?.updatedAt).toLocaleString()}</small>}
            </Card.Header>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                      name="contactNumber"
                      value={form.contactNumber}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Alternate Contact</Form.Label>
                    <Form.Control
                      name="alternateContact"
                      value={form.alternateContact}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Label>Guardian Details</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="guardianDetails"
                      value={form.guardianDetails}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Col>
                </Row>

                {editing && (
                  <div className="d-flex justify-content-end">
                    <Button variant="secondary" onClick={() => setEditing(false)} className="me-2">Cancel</Button>
                    <Button variant="primary" onClick={handleSave} disabled={saving}>
                      <FaSave className="me-2" /> {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentProfile;