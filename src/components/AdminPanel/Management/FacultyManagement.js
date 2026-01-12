import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Modal,
  Badge,
  InputGroup,
  Dropdown,
  Alert,
  Spinner
} from 'react-bootstrap';
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaUserPlus,
  FaFilter,
  FaUserTie,
  FaGraduationCap,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaChartLine,
  FaFilePdf,
  FaFileExcel
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [designations] = useState([
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Lecturer',
    'Lab Instructor',
    'Clinical Instructor',
    'Head of Department',
    'Dean'
  ]);

  // New faculty form
  const [newFaculty, setNewFaculty] = useState({
    facultyId: '',
    fullName: '',
    email: '',
    password: '',
    designation: 'Assistant Professor',
    department: '',
    qualification: '',
    specialization: '',
    experience: '',
    contactNumber: '',
    dateOfJoining: new Date().toISOString().split('T')[0],
    subjectsHandling: [],
    isActive: true
  });

  useEffect(() => {
    fetchFaculty();
    fetchDepartments();
  }, []);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/faculty');
      if (response.data.success) {
        setFaculty(response.data.data || []);
      } else {
        toast.error('Failed to fetch faculty');
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
      toast.error('Failed to fetch faculty');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/faculty');
      if (response.data.success) {
        setDepartments(response.data.filters?.departments || []);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const generateFacultyId = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `FAC${year}${randomNum}`;
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const facultyData = {
        ...newFaculty,
        facultyId: newFaculty.facultyId || generateFacultyId(),
        email: newFaculty.email.toLowerCase(),
        username: newFaculty.email.toLowerCase()
      };

      const response = await api.post('/admin/faculty', facultyData);
      
      if (response.data.success) {
        toast.success('Faculty added successfully');
        setShowAddModal(false);
        setNewFaculty({
          facultyId: '',
          fullName: '',
          email: '',
          password: '',
          designation: 'Assistant Professor',
          department: '',
          qualification: '',
          specialization: '',
          experience: '',
          contactNumber: '',
          dateOfJoining: new Date().toISOString().split('T')[0],
          subjectsHandling: [],
          isActive: true
        });
        fetchFaculty();
      } else {
        toast.error(response.data.message || 'Failed to add faculty');
      }
    } catch (error) {
      console.error('Error adding faculty:', error);
      toast.error('Failed to add faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;

    try {
      const response = await api.delete(`/admin/faculty/${id}`);
      if (response.data.success) {
        toast.success('Faculty deleted successfully');
        fetchFaculty();
      } else {
        toast.error(response.data.message || 'Failed to delete faculty');
      }
    } catch (error) {
      console.error('Error deleting faculty:', error);
      toast.error('Failed to delete faculty');
    }
  };

  const handleViewFaculty = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setShowViewModal(true);
  };

  const filteredFaculty = faculty.filter(member => {
    const matchesSearch = searchTerm === '' || 
      member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.facultyId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === '' || 
      member.department === filterDepartment;
    
    const matchesDesignation = filterDesignation === '' || 
      member.designation === filterDesignation;

    return matchesSearch && matchesDepartment && matchesDesignation;
  });

  const exportToCSV = () => {
    const headers = ['Faculty ID', 'Name', 'Email', 'Designation', 'Department', 'Qualification', 'Experience', 'Contact', 'Status'];
    const csvData = filteredFaculty.map(member => [
      member.facultyId,
      member.fullName,
      member.email,
      member.designation,
      member.department,
      member.qualification,
      member.experience,
      member.contactNumber,
      member.isActive ? 'Active' : 'Inactive'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faculty_list_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Faculty list exported to CSV');
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1">Faculty Management</h2>
          <p className="text-muted mb-0">Manage faculty members and their profiles</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={exportToCSV}>
            <FaFileExcel className="me-2" />
            Export CSV
          </Button>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <FaUserPlus className="me-2" />
            Add Faculty
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by name, ID, or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterDesignation}
                onChange={(e) => setFilterDesignation(e.target.value)}
              >
                <option value="">All Designations</option>
                {designations.map(desig => (
                  <option key={desig} value={desig}>{desig}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button variant="outline-secondary" onClick={fetchFaculty}>
                Refresh
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Faculty Stats */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Faculty</h6>
                  <h3 className="mb-0">{faculty.length}</h3>
                </div>
                <div className="text-primary">
                  <FaUserTie size={30} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Active</h6>
                  <h3 className="mb-0 text-success">
                    {faculty.filter(f => f.isActive).length}
                  </h3>
                </div>
                <div className="text-success">
                  <FaChartLine size={30} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Professors</h6>
                  <h3 className="mb-0 text-info">
                    {faculty.filter(f => f.designation?.includes('Professor')).length}
                  </h3>
                </div>
                <div className="text-info">
                  <FaGraduationCap size={30} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Departments</h6>
                  <h3 className="mb-0 text-warning">
                    {[...new Set(faculty.map(f => f.department))].length}
                  </h3>
                </div>
                <div className="text-warning">
                  <FaUserTie size={30} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Faculty Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading faculty data...</p>
            </div>
          ) : filteredFaculty.length > 0 ? (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Faculty ID</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Department</th>
                    <th>Qualification</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.map((member, index) => (
                    <tr key={member._id}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{member.facultyId}</strong>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                               style={{ width: '36px', height: '36px' }}>
                            {member.fullName?.charAt(0) || 'F'}
                          </div>
                          <div>
                            <div>{member.fullName}</div>
                            <small className="text-muted">{member.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg="info" className="me-1">
                          {member.designation}
                        </Badge>
                      </td>
                      <td>{member.department}</td>
                      <td>{member.qualification}</td>
                      <td>{member.experience} years</td>
                      <td>
                        <Badge bg={member.isActive ? 'success' : 'secondary'}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewFaculty(member)}
                          >
                            <FaEye />
                          </Button>
                          <Button variant="outline-warning" size="sm">
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteFaculty(member._id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No faculty members found</p>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <FaUserPlus className="me-2" />
                Add First Faculty Member
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add Faculty Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Faculty Member</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddFaculty}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    value={newFaculty.fullName}
                    onChange={(e) => setNewFaculty({...newFaculty, fullName: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="faculty@institute.edu"
                    value={newFaculty.email}
                    onChange={(e) => setNewFaculty({...newFaculty, email: e.target.value})}
                    required
                  />
                  <Form.Text className="text-muted">
                    Will be used as username for login
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Password *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Set initial password"
                    value={newFaculty.password}
                    onChange={(e) => setNewFaculty({...newFaculty, password: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Faculty ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={newFaculty.facultyId}
                    onChange={(e) => setNewFaculty({...newFaculty, facultyId: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Designation *</Form.Label>
                  <Form.Select
                    value={newFaculty.designation}
                    onChange={(e) => setNewFaculty({...newFaculty, designation: e.target.value})}
                    required
                  >
                    {designations.map(desig => (
                      <option key={desig} value={desig}>{desig}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Department *</Form.Label>
                  <Form.Select
                    value={newFaculty.department}
                    onChange={(e) => setNewFaculty({...newFaculty, department: e.target.value})}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Qualification *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., M.Sc Nursing, Ph.D"
                    value={newFaculty.qualification}
                    onChange={(e) => setNewFaculty({...newFaculty, qualification: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Specialization</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Specialization area"
                    value={newFaculty.specialization}
                    onChange={(e) => setNewFaculty({...newFaculty, specialization: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Experience (Years)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="50"
                    value={newFaculty.experience}
                    onChange={(e) => setNewFaculty({...newFaculty, experience: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="9876543210"
                    value={newFaculty.contactNumber}
                    onChange={(e) => setNewFaculty({...newFaculty, contactNumber: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date of Joining</Form.Label>
                  <Form.Control
                    type="date"
                    value={newFaculty.dateOfJoining}
                    onChange={(e) => setNewFaculty({...newFaculty, dateOfJoining: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={newFaculty.isActive}
                    onChange={(e) => setNewFaculty({...newFaculty, isActive: e.target.value === 'true'})}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Faculty'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* View Faculty Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Faculty Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFaculty && (
            <Row>
              <Col md={4} className="text-center mb-4">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                     style={{ width: '120px', height: '120px', fontSize: '48px' }}>
                  {selectedFaculty.fullName?.charAt(0) || 'F'}
                </div>
                <h5>{selectedFaculty.fullName}</h5>
                <Badge bg="info">{selectedFaculty.designation}</Badge>
              </Col>
              <Col md={8}>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="border-bottom pb-2">
                      <small className="text-muted">Faculty ID</small>
                      <div className="fw-bold">{selectedFaculty.facultyId}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="border-bottom pb-2">
                      <small className="text-muted">Email</small>
                      <div className="fw-bold">{selectedFaculty.email}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="border-bottom pb-2">
                      <small className="text-muted">Department</small>
                      <div className="fw-bold">{selectedFaculty.department}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="border-bottom pb-2">
                      <small className="text-muted">Qualification</small>
                      <div className="fw-bold">{selectedFaculty.qualification}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="border-bottom pb-2">
                      <small className="text-muted">Experience</small>
                      <div className="fw-bold">{selectedFaculty.experience} years</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="border-bottom pb-2">
                      <small className="text-muted">Specialization</small>
                      <div className="fw-bold">{selectedFaculty.specialization || 'N/A'}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="border-bottom pb-2">
                      <small className="text-muted">Contact</small>
                      <div className="fw-bold">
                        <FaPhone className="me-2" />
                        {selectedFaculty.contactNumber || 'N/A'}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="border-bottom pb-2">
                      <small className="text-muted">Date of Joining</small>
                      <div className="fw-bold">
                        <FaCalendarAlt className="me-2" />
                        {new Date(selectedFaculty.dateOfJoining).toLocaleDateString()}
                      </div>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="border-bottom pb-2">
                      <small className="text-muted">Status</small>
                      <div>
                        <Badge bg={selectedFaculty.isActive ? 'success' : 'secondary'}>
                          {selectedFaculty.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            <FaEdit className="me-2" />
            Edit Profile
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FacultyManagement;