import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge, Image } from 'react-bootstrap';
import { FaUpload, FaEdit, FaTrash, FaImage, FaSearch, FaFilter } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const GalleryManager = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'Events',
    tags: '',
    featured: false,
    album: 'General'
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await api.get('/api/admin/gallery');
      setGalleryItems(response.data.data.gallery || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('category', uploadForm.category);
    formData.append('tags', uploadForm.tags);
    formData.append('featured', uploadForm.featured);
    formData.append('album', uploadForm.album);
    formData.append('image', imageFile);

    try {
      await api.post('/api/admin/gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Image uploaded successfully!');
      setShowUploadModal(false);
      resetUploadForm();
      fetchGalleryItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      await api.delete(`/api/admin/gallery/${selectedItem._id}`);
      toast.success('Gallery item deleted successfully');
      setShowDeleteModal(false);
      setSelectedItem(null);
      fetchGalleryItems();
    } catch (error) {
      toast.error('Failed to delete gallery item');
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      title: '',
      description: '',
      category: 'Events',
      tags: '',
      featured: false,
      album: 'General'
    });
    setImageFile(null);
  };

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !filterCategory || item.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(galleryItems.map(item => item.category))];
  const albums = [...new Set(galleryItems.map(item => item.album))];

  if (loading && galleryItems.length === 0) {
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
        <h2 className="h3 mb-0">Gallery Management</h2>
        <Button variant="primary" onClick={() => setShowUploadModal(true)}>
          <FaUpload className="me-2" />
          Upload Image
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Search by title, description or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="input-group">
                <span className="input-group-text">
                  <FaFilter />
                </span>
                <Form.Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Gallery Grid */}
      <Row className="g-4">
        {filteredItems.map(item => (
          <Col key={item._id} xs={12} sm={6} md={4} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                <Image
                  src={`${(process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '')}${item.imageUrl}`}
                  alt={item.title}
                  className="card-img-top"
                  style={{
                    objectFit: 'cover',
                    height: '100%',
                    width: '100%'
                  }}
                />
                {item.featured && (
                  <div className="position-absolute top-0 end-0 m-2">
                    <Badge bg="warning">Featured</Badge>
                  </div>
                )}
                <div className="position-absolute top-0 start-0 m-2">
                  <Badge bg="info">{item.category}</Badge>
                </div>
              </div>
              <Card.Body>
                <Card.Title className="h6 mb-2">{item.title}</Card.Title>
                <Card.Text className="small text-muted mb-2">
                  {item.description?.substring(0, 60)}...
                </Card.Text>
                <div className="small text-muted mb-3">
                  <div>Album: {item.album}</div>
                  <div>Views: {item.views || 0}</div>
                </div>
                <div className="d-flex justify-content-between">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => {
                      setSelectedItem(item);
                      // For edit, you would open an edit modal with pre-filled data
                      toast.info('Edit feature coming soon');
                    }}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDeleteModal(true);
                    }}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredItems.length === 0 && (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <FaImage size={48} className="text-muted mb-3" />
            <h5>No Gallery Items Found</h5>
            <p className="text-muted">
              {searchTerm || filterCategory 
                ? 'Try changing your search or filter criteria'
                : 'Click "Upload Image" to add your first gallery item'}
            </p>
          </Card.Body>
        </Card>
      )}

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => {
        setShowUploadModal(false);
        resetUploadForm();
      }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload Gallery Image</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUploadSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Image Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                  >
                    <option value="Events">Events</option>
                    <option value="Campus">Campus</option>
                    <option value="Practical">Practical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Album</Form.Label>
                  <Form.Control
                    type="text"
                    value={uploadForm.album}
                    onChange={(e) => setUploadForm({...uploadForm, album: e.target.value})}
                    placeholder="General"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tags (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                    placeholder="nursing, students, lab, etc."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Featured Image"
                    checked={uploadForm.featured}
                    onChange={(e) => setUploadForm({...uploadForm, featured: e.target.checked})}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Select Image *</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {imageFile && (
              <div className="text-center mt-3">
                <Image
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: '200px' }}
                />
                <p className="text-muted mt-2">{imageFile.name}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GalleryManager;