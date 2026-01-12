import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Badge, Table, InputGroup } from 'react-bootstrap';
import { FaDownload, FaSearch, FaFilter, FaFilePdf, FaFileWord, FaFileExcel, FaFileArchive } from 'react-icons/fa';
import api from '../../../services/api';
import useAutoRefresh from '../../../hooks/useAutoRefresh';
import toast from 'react-hot-toast';

const DownloadCenter = () => {
  const [downloads, setDownloads] = useState([]);
  const [filteredDownloads, setFilteredDownloads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    // Load initial downloads data on mount
    fetchDownloads();
  }, []);

  useEffect(() => {
    filterDownloads();
  }, [searchTerm, selectedCategory, selectedType, downloads]);

  const fetchDownloads = async () => {
    try {
      const response = await api.get('/student/downloads');
      const data = response.data.data;
      setDownloads(data.downloads || []);
      setFilteredDownloads(data.downloads || []);
      setCategories(data.filters?.categories || []);
    } catch (error) {
      console.error('Error fetching downloads:', error);
      toast.error('Failed to load downloads');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh downloads every 5 minutes and refetch when tab becomes visible
  useAutoRefresh(fetchDownloads, 300000);

  useEffect(() => {
    const handler = () => fetchDownloads();
    window.addEventListener('realtime:downloads', handler);
    return () => window.removeEventListener('realtime:downloads', handler);
  }, [downloads]);

  const filterDownloads = () => {
    let filtered = downloads;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // File type filter
    if (selectedType !== 'All') {
      filtered = filtered.filter(item => item.fileType === selectedType);
    }

    setFilteredDownloads(filtered);
  };

  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'PDF':
        return <FaFilePdf className="text-danger" />;
      case 'DOC':
      case 'DOCX':
        return <FaFileWord className="text-primary" />;
      case 'XLS':
      case 'XLSX':
        return <FaFileExcel className="text-success" />;
      case 'ZIP':
      case 'RAR':
        return <FaFileArchive className="text-warning" />;
      default:
        return <FaFilePdf className="text-secondary" />;
    }
  };

  const getFileTypeColor = (fileType) => {
    switch (fileType) {
      case 'PDF': return 'danger';
      case 'DOC':
      case 'DOCX': return 'primary';
      case 'XLS':
      case 'XLSX': return 'success';
      case 'ZIP':
      case 'RAR': return 'warning';
      default: return 'secondary';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async (downloadId, fileName) => {
    try {
      toast.loading('Preparing download...');
      
      // Record the download
      await api.post(`/student/downloads/${downloadId}/record`);
      
      // Trigger actual file download
      const response = await api.get(`/downloads/${downloadId}/file`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.dismiss();
      toast.success('Download started!');
      
      // Refresh download count
      fetchDownloads();
    } catch (error) {
      toast.dismiss();
      toast.error('Download failed');
      console.error('Download error:', error);
    }
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Syllabus': 'primary',
      'Timetable': 'success',
      'Notes': 'info',
      'Question Paper': 'warning',
      'Lab Manual': 'danger',
      'Form': 'secondary',
      'Circular': 'dark',
      'Result': 'primary',
      'Hall Ticket': 'success',
      'Certificate': 'info',
      'Other': 'secondary'
    };
    return colorMap[category] || 'secondary';
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading downloads...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="download-center">
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <Card.Title className="mb-1">
                <FaDownload className="me-2 text-primary" />
                Download Center
              </Card.Title>
              <p className="text-muted mb-0">
                Access study materials, forms, and documents
              </p>
            </div>
            <Badge bg="primary" className="fs-6">
              {filteredDownloads.length} Files Available
            </Badge>
          </div>

          {/* Search and Filter */}
          <Row className="g-3 mb-4">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search files by title, description or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="All">All File Types</option>
                <option value="PDF">PDF Files</option>
                <option value="DOC">Word Documents</option>
                <option value="XLS">Excel Files</option>
                <option value="ZIP">Archive Files</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Filter Summary */}
          {(searchTerm || selectedCategory !== 'All' || selectedType !== 'All') && (
            <div className="mb-4">
              <small className="text-muted">
                <FaFilter className="me-1" />
                Filters: 
                {searchTerm && <Badge bg="info" className="ms-2">Search: {searchTerm}</Badge>}
                {selectedCategory !== 'All' && (
                  <Badge bg="primary" className="ms-2">Category: {selectedCategory}</Badge>
                )}
                {selectedType !== 'All' && (
                  <Badge bg="success" className="ms-2">Type: {selectedType}</Badge>
                )}
                <Button 
                  variant="link" 
                  size="sm" 
                  className="ms-2"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedType('All');
                  }}
                >
                  Clear Filters
                </Button>
              </small>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Downloads Grid */}
      {filteredDownloads.length > 0 ? (
        <Row className="g-4">
          {filteredDownloads.map((item) => (
            <Col key={item._id} lg={4} md={6}>
              <Card className="border-0 shadow-sm h-100 download-card">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-start mb-3">
                    <div className="me-3">
                      <div className="bg-light rounded p-3">
                        {getFileTypeIcon(item.fileType)}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <Badge 
                        bg={getCategoryColor(item.category)} 
                        className="mb-2"
                      >
                        {item.category}
                      </Badge>
                      <h6 className="mb-1">{item.title}</h6>
                      <small className="text-muted">
                        {item.description || 'No description available'}
                      </small>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <Badge bg={getFileTypeColor(item.fileType)} className="me-2">
                          {item.fileType}
                        </Badge>
                        <small className="text-muted">
                          {formatFileSize(item.fileSize)}
                        </small>
                      </div>
                      <small className="text-muted">
                        <FaDownload className="me-1" />
                        {item.downloadCount || 0}
                      </small>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}
                      </small>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleDownload(item._id, item.fileName)}
                        className="d-flex align-items-center"
                      >
                        <FaDownload className="me-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <div className="mb-3">
              <FaDownload size={48} className="text-muted" />
            </div>
            <h5>No files found</h5>
            <p className="text-muted mb-0">
              {searchTerm || selectedCategory !== 'All' || selectedType !== 'All'
                ? 'Try changing your search or filter criteria'
                : 'No downloads available at the moment'}
            </p>
            {(searchTerm || selectedCategory !== 'All' || selectedType !== 'All') && (
              <Button
                variant="outline-primary"
                className="mt-3"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedType('All');
                }}
              >
                Clear Filters
              </Button>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Categories Summary */}
      <Card className="border-0 shadow-sm mt-4">
        <Card.Body>
          <h6 className="mb-3">Available Categories</h6>
          <div className="d-flex flex-wrap gap-2">
            <Badge 
              bg={selectedCategory === 'All' ? 'primary' : 'light text-dark'} 
              className="px-3 py-2 cursor-pointer"
              onClick={() => setSelectedCategory('All')}
            >
              All Files ({downloads.length})
            </Badge>
            {categories.map((category, index) => {
              const count = downloads.filter(d => d.category === category).length;
              return (
                <Badge
                  key={index}
                  bg={selectedCategory === category ? getCategoryColor(category) : 'light text-dark'}
                  className="px-3 py-2 cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category} ({count})
                </Badge>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      <style jsx>{`
        .download-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .download-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default DownloadCenter;