import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Dropdown, Pagination, Modal } from 'react-bootstrap';
import { 
  FaFilter, 
  FaCalendarAlt, 
  FaHeart, 
  FaComment, 
  FaEye,
  FaShare,
  FaDownload,
  FaTimes
} from 'react-icons/fa';
import api from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
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
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchGalleryData();
  }, []);

  useEffect(() => {
    filterGalleryItems();
  }, [selectedCategory, selectedAlbum, searchTerm, galleryItems]);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const [galleryRes, albumsRes] = await Promise.all([
        api.get('/gallery'),
        api.get('/gallery/albums')
      ]);

      const galleryData = galleryRes.data?.data || {};
      const items = galleryData.gallery || [];

      setGalleryItems(items);
      setAlbums(albumsRes.data?.data || galleryData.filters?.albums || []);

      // Extract unique categories from response filters or items
      const uniqueCategories = galleryData.filters?.categories || [...new Set(items.map(item => item.category))];
      setCategories(uniqueCategories);
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

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleLike = async (itemId) => {
    try {
      await api.post(`/gallery/${itemId}/like`);
      toast.success('Liked!');
      // Refresh gallery data
      fetchGalleryData();
    } catch (error) {
      toast.error('Please login to like images');
    }
  };

  const openImageModal = (item) => {
    setSelectedImage(item);
    setShowModal(true);
  };

  const getPublicImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const apiHost = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api$/, '');
    return `${apiHost}${url}`;
  };

  const downloadImage = (imageUrl) => {
    const link = document.createElement('a');
    link.href = getPublicImageUrl(imageUrl);
    link.download = 'nursing-institute-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className="py-5">
      {/* Gallery Header */}
      <Row className="mb-5">
        <Col>
          <h1 className="display-5 fw-bold mb-3">Photo Gallery</h1>
          <p className="lead text-muted">
            Explore moments from our campus life, events, practical sessions, and more.
          </p>
        </Col>
      </Row>

      {/* Filters Section */}
      <Card className="border-0 shadow-sm mb-5">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex flex-wrap gap-3">
                {/* Category Filter */}
                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary" className="d-flex align-items-center">
                    <FaFilter className="me-2" />
                    {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSelectedCategory('all')}>
                      All Categories
                    </Dropdown.Item>
                    {categories.map((category, index) => (
                      <Dropdown.Item 
                        key={index}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                {/* Album Filter */}
                <Dropdown>
                  <Dropdown.Toggle variant="outline-success" className="d-flex align-items-center">
                    <FaCalendarAlt className="me-2" />
                    {selectedAlbum === 'all' ? 'All Albums' : selectedAlbum}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSelectedAlbum('all')}>
                      All Albums
                    </Dropdown.Item>
                    {albums.map((album, index) => (
                      <Dropdown.Item 
                        key={index}
                        onClick={() => setSelectedAlbum(album.name)}
                      >
                        {album.name} ({album.count})
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                {/* Search Box */}
                <div className="flex-grow-1">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search images by title, description or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="text-muted">
                Showing {filteredItems.length} of {galleryItems.length} images
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Gallery Grid */}
      {currentItems.length > 0 ? (
        <>
          <Row className="g-4">
            {currentItems.map((item) => (
              <Col key={item._id} xs={12} sm={6} md={4} lg={3}>
                <Card className="border-0 shadow-sm h-100 gallery-item">
                  <div 
                    className="position-relative overflow-hidden rounded-top"
                    style={{ height: '200px', cursor: 'pointer' }}
                    onClick={() => openImageModal(item)}
                  >
                    <img
                      src={item.fullThumbnailUrl || item.fullImageUrl || getPublicImageUrl(item.thumbnailUrl || item.imageUrl)}
                      alt={item.title}
                      className="img-fluid w-100 h-100 object-fit-cover"
                      style={{ transition: 'transform 0.5s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <Badge bg="primary">{item.category}</Badge>
                    </div>
                  </div>
                  <Card.Body>
                    <h6 className="card-title mb-2">{item.title}</h6>
                    <p className="card-text small text-muted mb-3">
                      {item.description?.substring(0, 100)}
                      {item.description?.length > 100 ? '...' : ''}
                    </p>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleLike(item._id)}
                        >
                          <FaHeart className="me-1" />
                          {item.likesCount || 0}
                        </Button>
                        <Button variant="outline-info" size="sm">
                          <FaComment className="me-1" />
                          {item.commentsCount || 0}
                        </Button>
                      </div>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => downloadImage(item.imageUrl)}
                      >
                        <FaDownload />
                      </Button>
                    </div>

                    <div className="mt-3">
                      <small className="text-muted d-block">
                        <FaEye className="me-1" />
                        {item.views || 0} views
                      </small>
                      <small className="text-muted">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination>
                <Pagination.Prev 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                />
                
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                
                <Pagination.Next 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-5">
          <h4>No images found</h4>
          <p className="text-muted">Try changing your filters or search term</p>
          <Button 
            variant="primary"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedAlbum('all');
              setSearchTerm('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Image Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        {selectedImage && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedImage.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img
                src={selectedImage.fullImageUrl || getPublicImageUrl(selectedImage.imageUrl)}
                alt={selectedImage.title}
                className="img-fluid rounded mb-3"
              />
              <p>{selectedImage.description}</p>
              
              <div className="d-flex flex-wrap gap-2 mb-3">
                {selectedImage.tags?.map((tag, index) => (
                  <Badge key={index} bg="secondary">#{tag}</Badge>
                ))}
              </div>
              
              <div className="d-flex justify-content-between text-muted">
                <small>
                  <FaCalendarAlt className="me-1" />
                  {new Date(selectedImage.createdAt).toLocaleDateString()}
                </small>
                <small>
                  <FaEye className="me-1" />
                  {selectedImage.views || 0} views
                </small>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button 
                variant="outline-primary"
                onClick={() => downloadImage(selectedImage.imageUrl)}
              >
                <FaDownload className="me-2" />
                Download
              </Button>
              <Button 
                variant="outline-danger"
                onClick={() => handleLike(selectedImage._id)}
              >
                <FaHeart className="me-2" />
                Like ({selectedImage.likesCount || 0})
              </Button>
              <Button variant="primary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
};

// Badge component (if not imported)
const Badge = ({ children, bg, className = '' }) => (
  <span className={`badge ${bg} ${className}`}>
    {children}
  </span>
);

export default GalleryPage;