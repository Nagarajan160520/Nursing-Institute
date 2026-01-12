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
  Spinner,
  ProgressBar
} from 'react-bootstrap';
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaDownload,
  FaPrint,
  FaUpload,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileArchive,
  FaTags,
  FaCalendar,
  FaUser
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const DownloadManager = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedDownload, setSelectedDownload] = useState(null);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    category: '',
    academicYear: '',
    semester: '',
    search: '',
    page: 1,
    limit: 20
  });

  // Upload form
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    academicYear: '',
    semester: '',
    subject: '',
    tags: '',
    targetAudience: 'all',
    requiresLogin: false,
    expiryDate: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Edit form
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    academicYear: '',
    semester: '',
    subject: '',
    tags: '',
    targetAudience: 'all',
    requiresLogin: false,
    expiryDate: ''
  });

  useEffect(() => {
    fetchDownloads();
    fetchStats();
  }, [filters]);

  const fetchDownloads = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/downloads', { params: filters });
      setDownloads(response.data.data.downloads || []);
      setStats(response.data.data.stats || {});
    } catch (error) {
      toast.error('Failed to fetch downloads');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Stats are included in the downloads response
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!uploadForm.title || !uploadForm.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();

      // Add file
      formData.append('file', selectedFile);

      // Add form data
      Object.keys(uploadForm).forEach(key => {
        if (uploadForm[key] !== null && uploadForm[key] !== undefined && uploadForm[key] !== '') {
          if (key === 'targetAudience') {
            formData.append(key, uploadForm[key]);
          } else if (key === 'tags' && uploadForm[key]) {
            formData.append(key, uploadForm[key]);
          } else {
            formData.append(key, uploadForm[key]);
          }
        }
      });

      const response = await api.post('/admin/downloads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      toast.success('File uploaded successfully!');
      setShowUpload(false);
      setUploadForm({
        title: '',
        description: '',
        category: '',
        academicYear: '',
        semester: '',
        subject: '',
        tags: '',
        targetAudience: 'all',
        requiresLogin: false,
        expiryDate: ''
      });
      setSelectedFile(null);
      setUploadProgress(0);
      fetchDownloads();

    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(`/admin/downloads/${selectedDownload._id}`, editForm);
      toast.success('Download updated successfully!');
      setShowEdit(false);
      setSelectedDownload(null);
      fetchDownloads();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (downloadId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      await api.delete(`/admin/downloads/${downloadId}`);
      toast.success('File deleted successfully!');
      fetchDownloads();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const openEditModal = (download) => {
    setSelectedDownload(download);
    setEditForm({
      title: download.title,
      description: download.description || '',
      category: download.category,
      academicYear: download.academicYear || '',
      semester: download.semester || '',
      subject: download.subject || '',
      tags: download.tags ? download.tags.join(', ') : '',
      targetAudience: download.targetAudience ? download.targetAudience.join(', ') : 'all',
      requiresLogin: download.requiresLogin || false,
      expiryDate: download.expiryDate ? new Date(download.expiryDate).toISOString().split('T')[0] : ''
    });
    setShowEdit(true);
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

  const exportDownloads = () => {
    // Create CSV content
    const headers = ['Title', 'Category', 'File Type', 'Size', 'Downloads', 'Uploaded Date'];
    const rows = downloads.map(download => [
      download.title,
      download.category,
      download.fileType,
      formatFileSize(download.fileSize),
      download.downloadCount || 0,
      new Date(download.uploadedAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `downloads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h3 className="mb-0">Download Manager</h3>
          <p className="text-muted">Manage study materials and documents for students</p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="outline-primary" onClick={exportDownloads}>
            <FaDownload className="me-2" /> Export CSV
          </Button>
          <Button variant="primary" onClick={() => setShowUpload(true)}>
            <FaUpload className="me-2" /> Upload File
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
                  <h6 className="mb-1 opacity-75">Total Files</h6>
                  <h3 className="mb-0">{stats.totalFiles || downloads.length}</h3>
                </div>
                <FaDownload size={30} className="opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 opacity-75">Total Downloads</h6>
                  <h3 className="mb-0">{stats.totalDownloads || 0}</h3>
                </div>
                <FaDownload size={30} className="opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3}>
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 opacity-75">This Month</h6>
                  <h3 className="mb-0">
                    {downloads.filter(d =>
                      new Date(d.uploadedAt).getMonth() === new Date().getMonth()
                    ).length}
                  </h3>
                </div>
                <FaCalendar size={30} className="opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3}>
          <Card className="border-0 shadow-sm bg-warning text-dark">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 opacity-75">Avg Downloads/File</h6>
                  <h3 className="mb-0">
                    {downloads.length > 0
                      ? Math.round((stats.totalDownloads || 0) / downloads.length)
                      : 0}
                  </h3>
                </div>
                <FaUser size={30} className="opacity-75" />
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
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  <option value="Syllabus">Syllabus</option>
                  <option value="Timetable">Timetable</option>
                  <option value="Notes">Notes</option>
                  <option value="Question Paper">Question Paper</option>
                  <option value="Lab Manual">Lab Manual</option>
                  <option value="Form">Form</option>
                  <option value="Circular">Circular</option>
                  <option value="Result">Result</option>
                  <option value="Hall Ticket">Hall Ticket</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label>Academic Year</Form.Label>
                <Form.Select
                  value={filters.academicYear}
                  onChange={(e) => setFilters({ ...filters, academicYear: e.target.value })}
                >
                  <option value="">All Years</option>
                  <option value="2028">2028</option>
                  <option value="2027">2027</option>
                  <option value="2026">2026</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label>Semester</Form.Label>
                <Form.Select
                  value={filters.semester}
                  onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                >
                  <option value="">All Semesters</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <InputGroup>
                  <FormControl
                    placeholder="Search by title, description, subject..."
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
              <Button variant="primary" onClick={fetchDownloads}>
                <FaFilter /> Filter
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Downloads Table */}
      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading downloads...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>File</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Size</th>
                    <th>Downloads</th>
                    <th>Uploaded</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {downloads.map((download) => (
                    <tr key={download._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {getFileTypeIcon(download.fileType)}
                          <Badge bg={getFileTypeColor(download.fileType)} className="ms-2">
                            {download.fileType}
                          </Badge>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{download.title}</strong>
                          {download.description && (
                            <div className="text-muted small" style={{ maxWidth: '200px' }}>
                              {download.description.length > 50
                                ? `${download.description.substring(0, 50)}...`
                                : download.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge bg={getCategoryColor(download.category)}>
                          {download.category}
                        </Badge>
                      </td>
                      <td>{formatFileSize(download.fileSize)}</td>
                      <td>
                        <Badge bg="secondary">
                          <FaDownload className="me-1" />
                          {download.downloadCount || 0}
                        </Badge>
                      </td>
                      <td>
                        <small>
                          {new Date(download.uploadedAt).toLocaleDateString()}
                          <br />
                          <span className="text-muted">
                            by {download.uploadedBy?.username || 'Admin'}
                          </span>
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => openEditModal(download)}
                            title="Edit"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(download._id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {downloads.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <FaDownload size={48} className="text-muted mb-3 opacity-50" />
                        <p className="text-muted">No files uploaded yet</p>
                        <Button variant="primary" onClick={() => setShowUpload(true)}>
                          <FaUpload className="me-2" /> Upload First File
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Upload Modal */}
      <Modal show={showUpload} onHide={() => setShowUpload(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload Study Material</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpload}>
          <Modal.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    placeholder="Enter file title"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    placeholder="Enter file description"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        value={uploadForm.category}
                        onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Syllabus">Syllabus</option>
                        <option value="Timetable">Timetable</option>
                        <option value="Notes">Notes</option>
                        <option value="Question Paper">Question Paper</option>
                        <option value="Lab Manual">Lab Manual</option>
                        <option value="Form">Form</option>
                        <option value="Circular">Circular</option>
                        <option value="Result">Result</option>
                        <option value="Hall Ticket">Hall Ticket</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Academic Year</Form.Label>
                      <Form.Select
                        value={uploadForm.academicYear}
                        onChange={(e) => setUploadForm({ ...uploadForm, academicYear: e.target.value })}
                      >
                        <option value="">Select Year</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Semester</Form.Label>
                      <Form.Select
                        value={uploadForm.semester}
                        onChange={(e) => setUploadForm({ ...uploadForm, semester: e.target.value })}
                      >
                        <option value="">Select Semester</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        <option value="5">Semester 5</option>
                        <option value="6">Semester 6</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control
                        type="text"
                        value={uploadForm.subject}
                        onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                        placeholder="Enter subject name"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                    placeholder="Enter tags separated by commas"
                  />
                  <Form.Text className="text-muted">
                    Separate multiple tags with commas
                  </Form.Text>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Target Audience</Form.Label>
                      <Form.Select
                        value={uploadForm.targetAudience}
                        onChange={(e) => setUploadForm({ ...uploadForm, targetAudience: e.target.value })}
                      >
                        <option value="all">All Students</option>
                        <option value="specific_course">Specific Course</option>
                        <option value="specific_semester">Specific Semester</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={uploadForm.expiryDate}
                        onChange={(e) => setUploadForm({ ...uploadForm, expiryDate: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Requires login to download"
                    checked={uploadForm.requiresLogin}
                    onChange={(e) => setUploadForm({ ...uploadForm, requiresLogin: e.target.checked })}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Select File *</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.jpg,.jpeg,.png"
                    required
                  />
                  <Form.Text className="text-muted">
                    Supported formats: PDF, DOC, DOCX, XLS, XLSX, ZIP, RAR, JPG, PNG
                  </Form.Text>
                </Form.Group>

                {selectedFile && (
                  <Alert variant="info">
                    <strong>Selected File:</strong> {selectedFile.name}
                    <br />
                    <strong>Size:</strong> {formatFileSize(selectedFile.size)}
                    <br />
                    <strong>Type:</strong> {selectedFile.type}
                  </Alert>
                )}

                {uploading && (
                  <div className="mt-3">
                    <div className="mb-2">Uploading...</div>
                    <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
                  </div>
                )}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUpload(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Download</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEdit}>
          <Modal.Body>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Enter file title"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Enter file description"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Syllabus">Syllabus</option>
                        <option value="Timetable">Timetable</option>
                        <option value="Notes">Notes</option>
                        <option value="Question Paper">Question Paper</option>
                        <option value="Lab Manual">Lab Manual</option>
                        <option value="Form">Form</option>
                        <option value="Circular">Circular</option>
                        <option value="Result">Result</option>
                        <option value="Hall Ticket">Hall Ticket</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Academic Year</Form.Label>
                      <Form.Select
                        value={editForm.academicYear}
                        onChange={(e) => setEditForm({ ...editForm, academicYear: e.target.value })}
                      >
                        <option value="">Select Year</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Semester</Form.Label>
                      <Form.Select
                        value={editForm.semester}
                        onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })}
                      >
                        <option value="">Select Semester</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        <option value="5">Semester 5</option>
                        <option value="6">Semester 6</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control
                        type="text"
                        value={editForm.subject}
                        onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                        placeholder="Enter subject name"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    placeholder="Enter tags separated by commas"
                  />
                  <Form.Text className="text-muted">
                    Separate multiple tags with commas
                  </Form.Text>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Target Audience</Form.Label>
                      <Form.Select
                        value={editForm.targetAudience}
                        onChange={(e) => setEditForm({ ...editForm, targetAudience: e.target.value })}
                      >
                        <option value="all">All Students</option>
                        <option value="specific_course">Specific Course</option>
                        <option value="specific_semester">Specific Semester</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={editForm.expiryDate}
                        onChange={(e) => setEditForm({ ...editForm, expiryDate: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Requires login to download"
                    checked={editForm.requiresLogin}
                    onChange={(e) => setEditForm({ ...editForm, requiresLogin: e.target.checked })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update File
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default DownloadManager;
