import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaImages, FaArrowRight, FaCamera } from 'react-icons/fa';
import api from '../../../services/api';

const GalleryPreview = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try multiple endpoints based on your backend structure
      let response;
      
      try {
        // Try public gallery endpoint first
        response = await api.get('/public/gallery?limit=6');
      } catch (err) {
        // Fallback to admin endpoint
        response = await api.get('/admin/gallery?limit=6');
      }
      
      if (response.data.success && response.data.data) {
        const galleryData = response.data.data.gallery || response.data.data;
        
        if (Array.isArray(galleryData) && galleryData.length > 0) {
          // Map the data to expected format
          const formattedItems = galleryData.map(item => ({
            _id: item._id,
            title: item.title || 'Gallery Image',
            category: item.category || 'General',
            imageUrl: item.imageUrl || item.imagenUrl || '/api/uploads/default-gallery.jpg',
            thumbnailUrl: item.thumbnailUrl || item.imageUrl,
            description: item.description || '',
            views: item.views || 0
          }));
          
          setGalleryItems(formattedItems.slice(0, 6));
        } else {
          // Use default images if no data
          useDefaultImages();
        }
      } else {
        useDefaultImages();
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setError('Failed to load gallery images');
      useDefaultImages();
    } finally {
      setLoading(false);
    }
  };

  const useDefaultImages = () => {
    const defaultImages = [
      { 
        _id: '1',
        title: 'Campus Infrastructure', 
        category: 'Campus', 
        imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Modern campus building'
      },
      { 
        _id: '2',
        title: 'Nursing Lab Session', 
        category: 'Practical', 
        imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Students practicing in nursing lab'
      },
      { 
        _id: '3',
        title: 'Annual Day Celebration', 
        category: 'Events', 
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Cultural performance at annual day'
      },
      { 
        _id: '4',
        title: 'Sports Competition', 
        category: 'Sports', 
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Annual sports day event'
      },
      { 
        _id: '5',
        title: 'Library & Study Area', 
        category: 'Campus', 
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Well-equipped library'
      },
      { 
        _id: '6',
        title: 'Lab Demonstration', 
        category: 'Practical', 
        imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Faculty demonstrating lab techniques'
      }
    ];
    setGalleryItems(defaultImages);
  };

  if (loading) {
    return (
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading gallery...</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-5 bg-light" style={{ position: 'relative' }}>
      <Container>
        <div className="text-center mb-5">
          <div 
            className="d-inline-flex align-items-center justify-content-center mb-3" 
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#3498db',
              borderRadius: '50%',
              boxShadow: '0 4px 20px rgba(52, 152, 219, 0.3)'
            }}
          >
            <FaCamera size={32} className="text-white" />
          </div>
          <h2 
            className="fw-bold mb-3" 
            style={{ 
              color: '#2c3e50',
              fontSize: '2.5rem',
              position: 'relative',
              display: 'inline-block'
            }}
          >
            Campus Gallery
            <div 
              style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                backgroundColor: '#3498db',
                borderRadius: '2px'
              }}
            ></div>
          </h2>
          <p 
            className="lead mb-4 mx-auto" 
            style={{ 
              color: '#7f8c8d',
              maxWidth: '600px',
              fontSize: '1.1rem'
            }}
          >
            Glimpse into the vibrant life of our nursing institute
          </p>
        </div>

        {error && (
          <div className="alert alert-warning text-center mb-4" role="alert">
            {error} - Showing sample images
          </div>
        )}

        <Row className="g-4">
          {galleryItems.map((item) => (
            <Col key={item._id} lg={4} md={6} sm={12}>
              <div
                className="h-100"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
                }}
              >
                <div 
                  style={{
                    position: 'relative',
                    height: '220px',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px'
                    }}
                  >
                    <span 
                      style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        padding: '5px 15px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      padding: '20px 15px 15px',
                    }}
                  >
                    <h6 
                      style={{
                        color: 'white',
                        margin: '0',
                        fontWeight: '600',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                      }}
                    >
                      {item.title}
                    </h6>
                  </div>
                </div>
                
                <div 
                  style={{
                    padding: '20px',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <p 
                    style={{
                      color: '#555',
                      marginBottom: '15px',
                      flexGrow: 1,
                      fontSize: '0.95rem',
                      lineHeight: '1.5'
                    }}
                  >
                    {item.description || 'Nursing institute activity'}
                  </p>
                  <div 
                    className="d-flex justify-content-between align-items-center"
                    style={{
                      borderTop: '1px solid #eee',
                      paddingTop: '15px',
                      marginTop: 'auto'
                    }}
                  >
                    <small style={{ color: '#7f8c8d' }}>
                      <FaImages className="me-1" />
                      {item.views || 0} views
                    </small>
                    <Link 
                      to={`/gallery/${item._id}`}
                      className="text-decoration-none"
                      style={{ 
                        color: '#3498db',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-5 pt-3">
          <Link 
            to="/gallery" 
            className="text-decoration-none d-inline-flex align-items-center justify-content-center"
            style={{
              backgroundColor: 'transparent',
              color: '#3498db',
              border: '2px solid #3498db',
              padding: '12px 35px',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              zIndex: '1'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'white';
              e.target.style.backgroundColor = '#3498db';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#3498db';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <span>View Full Gallery</span>
            <FaArrowRight className="ms-2" />
          </Link>
        </div>
      </Container>

      {/* Add some custom CSS for better responsiveness */}
      <style jsx="true">{`
        @media (max-width: 768px) {
          .gallery-item {
            margin-bottom: 20px;
          }
        }
        
        @media (max-width: 576px) {
          .gallery-image-container {
            height: 180px;
          }
        }
      `}</style>
    </section>
  );
};

export default GalleryPreview;