import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaSearch, FaFilter, FaImages, FaVideo, FaCalendar, FaEye, FaThumbsUp, FaComment } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [albums, setAlbums] = useState([]);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchGalleryData();
  }, []);

  useEffect(() => {
    filterGalleryItems();
  }, [galleryItems, selectedCategory, selectedAlbum, searchQuery]);

  const getPublicImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const apiHost = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api$/, '');
    return `${apiHost}${url}`;
  };

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/public/gallery');
      const data = response.data?.data || {};

      const items = data.gallery || [];

      setGalleryItems(items);
      setFilteredItems(items);
      setCategories(data.filters?.categories || [...new Set(items.map(i => i.category))]);
      setAlbums(data.filters?.albums || []);
    } catch (error) {
      console.error('Error fetching gallery:', error.response?.data || error.message);
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const filterGalleryItems = () => {
    let filtered = [...galleryItems];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by album
    if (selectedAlbum !== 'all') {
      filtered = filtered.filter(item => item.album === selectedAlbum);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredItems(filtered);
  };

  const handleImageClick = (item) => {
    setSelectedImage(item);
    setShowModal(true);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedAlbum('all');
    setSearchQuery('');
  };

  const categoryStats = {
    'Events': galleryItems.filter(item => item.category === 'Events').length,
    'Campus': galleryItems.filter(item => item.category === 'Campus').length,
    'Practical': galleryItems.filter(item => item.category === 'Practical').length,
    'Cultural': galleryItems.filter(item => item.category === 'Cultural').length,
    'Sports': galleryItems.filter(item => item.category === 'Sports').length
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading gallery...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Page Header */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary mb-3">Photo Gallery</h1>
        <p className="lead text-muted">
          Explore moments from our campus life, events, practical sessions, and celebrations.
        </p>
      </div>

      {/* Statistics */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Row className="g-3 text-center">
                <Col xs={6} md={3}>
                  <div className="p-3 bg-primary bg-opacity-10 rounded">
                    <FaImages className="text-primary mb-2" size={24} />
                    <h4 className="mb-1">{galleryItems.length}</h4>
                    <p className="mb-0 text-muted">Total Images</p>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="p-3 bg-success bg-opacity-10 rounded">
                    <FaCalendar className="text-success mb-2" size={24} />
                    <h4 className="mb-1">{categories.length}</h4>
                    <p className="mb-0 text-muted">Categories</p>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="p-3 bg-warning bg-opacity-10 rounded">
                    <FaEye className="text-warning mb-2" size={24} />
                    <h4 className="mb-1">
                      {galleryItems.reduce((total, item) => total + (item.views || 0), 0)}
                    </h4>
                    <p className="mb-0 text-muted">Total Views</p>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="p-3 bg-info bg-opacity-10 rounded">
                    <FaThumbsUp className="text-info mb-2" size={24} />
                    <h4 className="mb-1">
                      {galleryItems.reduce((total, item) => total + (item.likesCount || 0), 0)}
                    </h4>
                    <p className="mb-0 text-muted">Total Likes</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  <FaSearch className="me-2" />
                  Search Gallery
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by title, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>
                  <FaFilter className="me-2" />
                  Category
                </Form.Label>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category} ({categoryStats[category] || 0})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            {/*<Col md={3}>
              <Form.Group>
                <Form.Label>Album</Form.Label>
                <Form.Select
                  value={selectedAlbum}
                  onChange={(e) => setSelectedAlbum(e.target.value)}
                >
                  <option value="all">All Albums</option>
                  {albums.map((album) => (
                    <option key={album} value={album}>
                      {album}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col> */} 
            <Col md={2}>
              <Button variant="outline-secondary" onClick={resetFilters} className="w-100">
                Reset Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Results Info */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-0">
            Showing {filteredItems.length} of {galleryItems.length} images
          </h5>
          {selectedCategory !== 'all' && (
            <small className="text-muted">
              Category: <span className="fw-semibold">{selectedCategory}</span>
            </small>
          )}
        </div>
        <div className="text-muted">
          <small>Click on any image to view details</small>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <Card className="border-0 shadow-sm text-center py-5">
          <Card.Body>
            <FaImages size={48} className="text-muted mb-3" />
            <h5>No images found</h5>
            <p className="text-muted">Try changing your filters or search terms</p>
            <Button variant="outline-primary" onClick={resetFilters}>
              Reset Filters
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {filteredItems.map((item) => (
            <Col key={item._id} xs={12} sm={6} md={4} lg={3}>
              <Card className="border-0 shadow-sm gallery-item">
                <div 
                  className="position-relative overflow-hidden rounded-top"
                  style={{ height: '200px', cursor: 'pointer' }}
                  onClick={() => handleImageClick(item)}
                >
                  <img
                    src={item.fullThumbnailUrl || item.fullImageUrl || getPublicImageUrl(item.imageUrl)}
                    alt={item.title}
                    className="w-100 h-100 object-fit-cover"
                    loading="lazy"
                  />
                  {item.featured && (
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge bg-warning">Featured</span>
                    </div>
                  )}
                </div>
                <Card.Body>
                  <h6 className="mb-2">{item.title}</h6>
                  <p className="text-muted small mb-2" style={{ height: '40px', overflow: 'hidden' }}>
                    {item.description || 'No description'}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-info">{item.category}</span>
                    <div className="d-flex gap-2 text-muted small">
                      <span>
                        <FaEye className="me-1" />
                        {item.views || 0}
                      </span>
                      {/*<span>
                        <FaThumbsUp className="me-1" />
                        {item.likesCount || 0}
                      </span>
                      <span>
                        <FaComment className="me-1" />
                        {item.commentsCount || 0}
                      </span> */}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Pagination (if needed) */}
      {filteredItems.length > 0 && (
        <div className="d-flex justify-content-center mt-5">
          <nav>
            <ul className="pagination">
              <li className="page-item disabled">
                <span className="page-link">Previous</span>
              </li>
              <li className="page-item active">
                <span className="page-link">1</span>
              </li>
              <li className="page-item">
                <a className="page-link" href="#!">2</a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#!">3</a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#!">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Video Gallery Section */}
      <Row className="mt-5">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <FaVideo className="text-primary me-3" size={24} />
                <h4 className="mb-0">Video Gallery</h4>
              </div>
              <Row className="g-4">
                <Col md={6} lg={4}>
                  <div className="ratio ratio-16x9">
                   <iframe width="560" height="315" src="https://www.youtube.com/embed/NkHiRlZ2qzM?si=RqfZq54Ivx7V9U6E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                  <p className="mt-2 mb-0 small">Campus Virtual Tour</p>
                </Col>
                <Col md={6} lg={4}>
                  <div className="ratio ratio-16x9">
                    <iframe
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Annual Day"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="mt-2 mb-0 small">Annual Day Celebration 2023</p>
                </Col>
                <Col md={6} lg={4}>
                  <div className="ratio ratio-16x9">
                    <iframe
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Lab Facilities"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="mt-2 mb-0 small">Lab Facilities Tour</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Image Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        {selectedImage && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedImage.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="text-center mb-4">
                <img
                  src={selectedImage.fullImageUrl || getPublicImageUrl(selectedImage.imageUrl)}
                  alt={selectedImage.title}
                  className="img-fluid rounded"
                  style={{ maxHeight: '400px' }}
                />
              </div>
              <Row>
                <Col md={8}>
                  <h6>Description</h6>
                  <p className="text-muted">
                    {selectedImage.description || 'No description available'}
                  </p>
                  {selectedImage.tags && selectedImage.tags.length > 0 && (
                    <div className="mt-3">
                      <h6>Tags</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {selectedImage.tags.map((tag, index) => (
                          <span key={index} className="badge bg-secondary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Col>
                <Col md={4}>
                  <div className="border rounded p-3">
                    <h6>Details</h6>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">
                        <strong>Category:</strong>{' '}
                        <span className="badge bg-info">{selectedImage.category}</span>
                      </li>
                      <li className="mb-2">
                        <strong>Album:</strong> {selectedImage.album || 'General'}
                      </li>
                      <li className="mb-2">
                        <strong>Uploaded:</strong>{' '}
                        {new Date(selectedImage.createdAt).toLocaleDateString()}
                      </li>
                      <li className="mb-2">
                        <strong>Views:</strong> {selectedImage.views || 0}
                      </li>
                     {/* <li className="mb-2">
                        <strong>Likes:</strong> {selectedImage.likesCount || 0}
                      </li>
                      <li>
                        <strong>Comments:</strong> {selectedImage.commentsCount || 0}
                      </li> */}
                    </ul>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
             {/* <Button variant="primary">
                <FaThumbsUp className="me-2" />
                Like Image
              </Button> */}
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default GalleryPage;