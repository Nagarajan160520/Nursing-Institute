import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Form,
  Modal,
  InputGroup,
  FormControl,
  Dropdown,
  Alert,
  Spinner
} from 'react-bootstrap';
import {
  FaEye,
  FaReply,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaUser,
  FaChartBar,
  FaDownload,
  FaPrint,
  FaTags,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
    page: 1,
    limit: 20
  });

  // Reply form
  const [replyForm, setReplyForm] = useState({
    message: ''
  });

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [filters]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/contacts', { params: filters });
      setContacts(response.data.data.contacts || []);
    } catch (error) {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/contacts/stats');
      setStats(response.data.data || {});
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await api.put(`/admin/contacts/${contactId}/status`, { status: newStatus });
      toast.success('Status updated');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/contacts/${selectedContact._id}/reply`, replyForm);
      toast.success('Reply sent successfully');
      setShowReply(false);
      setReplyForm({ message: '' });
      fetchContacts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reply');
    }
  };

  const exportContacts = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Subject', 'Category', 'Status', 'Date'];
    const rows = contacts.map(contact => [
      contact.name,
      contact.email,
      contact.phone || 'N/A',
      contact.subject,
      contact.category,
      contact.status,
      new Date(contact.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const statusColors = {
    New: 'primary',
    'In Progress': 'warning',
    Resolved: 'success',
    Closed: 'secondary',
    Spam: 'danger'
  };

  const categoryColors = {
    General: 'info',
    Admission: 'primary',
    Course: 'success',
    Fee: 'warning',
    Complaint: 'danger',
    Suggestion: 'secondary',
    Other: 'dark'
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h3 className="mb-0">Contact Management</h3>
          <p className="text-muted">Manage all contact form submissions</p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="outline-primary" onClick={exportContacts}>
            <FaDownload className="me-2" /> Export CSV
          </Button>
          <Button variant="outline-secondary" onClick={() => window.print()}>
            <FaPrint className="me-2" /> Print
          </Button>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col xs={12} md={6} lg={3}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 opacity-75">Total Contacts</h6>
                  <h3 className="mb-0">{stats.summary?.total || 0}</h3>
                </div>
                <FaEnvelope size={30} className="opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={6} lg={3}>
          <Card className="border-0 shadow-sm bg-warning text-dark">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 opacity-75">New Messages</h6>
                  <h3 className="mb-0">{stats.summary?.new || 0}</h3>
                </div>
                <FaEnvelope size={30} className="opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={6} lg={3}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 opacity-75">Resolved</h6>
                  <h3 className="mb-0">{stats.summary?.resolved || 0}</h3>
                </div>
                <FaCheckCircle size={30} className="opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={6} lg={3}>
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 opacity-75">Avg Response Time</h6>
                  <h3 className="mb-0">{stats.responseTime?.avgResponseTime?.toFixed(1) || 'N/A'}h</h3>
                </div>
                <FaClock size={30} className="opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                  <option value="Spam">Spam</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  <option value="General">General</option>
                  <option value="Admission">Admission</option>
                  <option value="Course">Course</option>
                  <option value="Fee">Fee</option>
                  <option value="Complaint">Complaint</option>
                  <option value="Suggestion">Suggestion</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={5}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <InputGroup>
                  <FormControl
                    placeholder="Search by name, email, subject..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                  <Button variant="outline-secondary">
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
            
            <Col md={1} className="d-flex align-items-end">
              <Button variant="primary" onClick={fetchContacts}>
                <FaFilter /> Filter
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Contacts Table */}
      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading contacts...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Subject</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact, index) => (
                    <tr key={contact._id}>
                      <td>{index + 1}</td>
                      <td>
                        <div>
                          <strong>{contact.name}</strong>
                          {contact.replied && (
                            <Badge bg="success" className="ms-2" pill>Replied</Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          <small className="d-block">
                            <FaEnvelope className="me-1" size={12} />
                            {contact.email}
                          </small>
                          {contact.phone && (
                            <small className="d-block">
                              <FaPhone className="me-1" size={12} />
                              {contact.phone}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '200px' }} title={contact.subject}>
                          {contact.subject}
                        </div>
                      </td>
                      <td>
                        <Badge bg={categoryColors[contact.category] || 'secondary'}>
                          {contact.category}
                        </Badge>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle 
                            variant={statusColors[contact.status] || 'secondary'} 
                            size="sm" 
                            id={`status-${contact._id}`}
                          >
                            {contact.status}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {Object.keys(statusColors).map(status => (
                              <Dropdown.Item 
                                key={status}
                                onClick={() => handleStatusChange(contact._id, status)}
                              >
                                {status}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                      <td>
                        <small>
                          {new Date(contact.createdAt).toLocaleDateString()}
                          <br />
                          <span className="text-muted">
                            {new Date(contact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => {
                              setSelectedContact(contact);
                              setShowDetails(true);
                            }}
                            title="View Details"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => {
                              setSelectedContact(contact);
                              setShowReply(true);
                            }}
                            title="Reply"
                            disabled={contact.replied}
                          >
                            <FaReply />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {contacts.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-5">
                        <FaEnvelope size={48} className="text-muted mb-3 opacity-50" />
                        <p className="text-muted">No contact messages found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Contact Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Contact Details</Modal.Title>
        </Modal.Header>
        {selectedContact && (
          <Modal.Body>
            <Row>
              <Col md={6}>
                <h6 className="text-muted">Sender Information</h6>
                <div className="mb-3">
                  <strong>Name:</strong> {selectedContact.name}
                </div>
                <div className="mb-3">
                  <strong>Email:</strong> {selectedContact.email}
                </div>
                {selectedContact.phone && (
                  <div className="mb-3">
                    <strong>Phone:</strong> {selectedContact.phone}
                  </div>
                )}
                <div className="mb-3">
                  <strong>IP Address:</strong> {selectedContact.ipAddress || 'N/A'}
                </div>
              </Col>
              
              <Col md={6}>
                <h6 className="text-muted">Message Details</h6>
                <div className="mb-3">
                  <strong>Category:</strong>{' '}
                  <Badge bg={categoryColors[selectedContact.category] || 'secondary'}>
                    {selectedContact.category}
                  </Badge>
                </div>
                <div className="mb-3">
                  <strong>Priority:</strong>{' '}
                  <Badge bg={
                    selectedContact.priority === 'Urgent' ? 'danger' :
                    selectedContact.priority === 'High' ? 'warning' :
                    selectedContact.priority === 'Medium' ? 'primary' : 'secondary'
                  }>
                    {selectedContact.priority}
                  </Badge>
                </div>
                <div className="mb-3">
                  <strong>Date:</strong> {new Date(selectedContact.createdAt).toLocaleString()}
                </div>
                <div className="mb-3">
                  <strong>Status:</strong>{' '}
                  <Badge bg={statusColors[selectedContact.status] || 'secondary'}>
                    {selectedContact.status}
                  </Badge>
                </div>
              </Col>
            </Row>
            
            <hr />
            
            <div className="mb-3">
              <strong>Subject:</strong>
              <p>{selectedContact.subject}</p>
            </div>
            
            <div className="mb-3">
              <strong>Message:</strong>
              <div className="border rounded p-3 bg-light">
                {selectedContact.message}
              </div>
            </div>
            
            {selectedContact.replied && (
              <div className="mb-3">
                <strong>Reply Sent:</strong>
                <div className="border rounded p-3 bg-success bg-opacity-10">
                  {selectedContact.replyMessage}
                  <div className="mt-2 text-muted small">
                    Replied by: {selectedContact.repliedBy?.username || 'Admin'} on{' '}
                    {new Date(selectedContact.repliedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
            
            {selectedContact.notes && selectedContact.notes.length > 0 && (
              <div className="mb-3">
                <strong>Notes:</strong>
                {selectedContact.notes.map((note, index) => (
                  <div key={index} className="border-start border-3 border-info ps-3 mb-2">
                    <p className="mb-1">{note.note}</p>
                    <small className="text-muted">
                      Added by {note.addedBy?.username || 'Admin'} on{' '}
                      {new Date(note.addedAt).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowDetails(false);
              setShowReply(true);
            }}
          >
            Reply
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reply Modal */}
      <Modal show={showReply} onHide={() => setShowReply(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reply to Contact</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleReply}>
          <Modal.Body>
            {selectedContact && (
              <div className="mb-3">
                <p>
                  <strong>To:</strong> {selectedContact.name} ({selectedContact.email})
                </p>
                <p>
                  <strong>Subject:</strong> Re: {selectedContact.subject}
                </p>
              </div>
            )}
            
            <Form.Group>
              <Form.Label>Your Reply Message *</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                value={replyForm.message}
                onChange={(e) => setReplyForm({ message: e.target.value })}
                placeholder="Type your reply message here..."
                required
              />
              <Form.Text className="text-muted">
                This message will be emailed to the sender.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReply(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Send Reply
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ContactManagement;