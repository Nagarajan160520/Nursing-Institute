import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaPlus, FaCalendar, FaTag, FaUser } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  
  // News form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'General',
    tags: '',
    isPublished: true,
    isPinned: false,
    featuredImage: '',
    targetAudience: ['all'],
    priority: 'medium',
    expiryDate: ''
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get('/admin/news');
      setNews(response.data.data.news || []);
    } catch (error) {
      toast.error('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingNews) {
        await api.put(`/admin/news/${editingNews._id}`, formData);
        toast.success('News updated successfully');
      } else {
        await api.post('/admin/news', formData);
        toast.success('News published successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchNews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save news');
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      excerpt: newsItem.excerpt || '',
      category: newsItem.category,
      tags: newsItem.tags?.join(', ') || '',
      isPublished: newsItem.isPublished,
      isPinned: newsItem.isPinned,
      featuredImage: newsItem.featuredImage || '',
      targetAudience: newsItem.targetAudience || ['all'],
      priority: newsItem.priority || 'medium',
      expiryDate: newsItem.expiryDate ? new Date(newsItem.expiryDate).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news?')) return;
    
    try {
      await api.delete(`/admin/news/${id}`);
      toast.success('News deleted successfully');
      fetchNews();
    } catch (error) {
      toast.error('Failed to delete news');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'General',
      tags: '',
      isPublished: true,
      isPinned: false,
      featuredImage: '',
      targetAudience: ['all'],
      priority: 'medium',
      expiryDate: ''
    });
    setEditingNews(null);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'General': 'primary',
      'Exam': 'warning',
      'Event': 'success',
      'Result': 'info',
      'Holiday': 'secondary',
      'Placement': 'dark'
    };
    return colors[category] || 'light';
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0">News & Events Management</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" />
          Add News
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Category</th>
                <th>Published Date</th>
                <th>Status</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      {item.featuredImage && (
                        <img 
                          src={item.featuredImage} 
                          alt={item.title}
                          className="me-2"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <strong>{item.title}</strong>
                        {item.isPinned && <Badge bg="warning" className="ms-2">Pinned</Badge>}
                        <div className="text-muted small">{item.excerpt?.substring(0, 60)}...</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                  </td>
                  <td>{new Date(item.publishedAt).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={item.isPublished ? 'success' : 'warning'}>
                      {item.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td>{item.views || 0}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <Button 
                        variant="outline-primary"
                        onClick={() => window.open(`/news/${item.slug}`, '_blank')}
                      >
                        <FaEye />
                      </Button>
                      <Button 
                        variant="outline-warning"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="outline-danger"
                        onClick={() => handleDelete(item._id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit News Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingNews ? 'Edit News' : 'Add New News'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Excerpt</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    placeholder="Brief summary (max 200 characters)"
                    maxLength={200}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Content *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={10}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="General">General</option>
                    <option value="Exam">Exam Notification</option>
                    <option value="Event">Event</option>
                    <option value="Result">Result</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Placement">Placement</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tags (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="nursing, education, event, etc."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </Form.Group>

                <div className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Publish Immediately"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Pin to Top"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({...formData, isPinned: e.target.checked})}
                  />
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Featured Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({...formData, featuredImage: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingNews ? 'Update News' : 'Publish News'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default NewsManager;