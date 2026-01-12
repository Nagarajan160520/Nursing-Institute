import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Alert, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch, 
  FaFilter,
  FaGraduationCap,
  FaCalendarAlt,
  FaUsers,
  FaRupeeSign, // ✅ Fixed: Use FaRupeeSign instead of FaIndianRupeeSign
  FaDownload,
  FaUpload,
  FaCalculator,
  FaMoneyBillWave,
  FaReceipt
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Course form state
  const [courseForm, setCourseForm] = useState({
    courseCode: '',
    courseName: '',
    description: '',
    duration: '4 Years',
    eligibility: '',
    seatsAvailable: 60,
    careerOpportunities: '',
    feesStructure: {
      tuitionFee: 50000,
      hostelFee: 20000,
      libraryFee: 5000,
      labFee: 3000,
      examFee: 2000,
      otherCharges: 10000,
      installmentPlan: [
        { installmentNo: 1, amount: 25000, dueDate: '2024-07-15', label: 'First Installment' },
        { installmentNo: 2, amount: 25000, dueDate: '2024-11-15', label: 'Second Installment' }
      ]
    },
    isActive: true
  });

  // Fee calculation state
  const [feeCalculation, setFeeCalculation] = useState({
    baseFee: 0,
    discountPercent: 0,
    discountAmount: 0,
    lateFee: 0,
    taxPercent: 18,
    taxAmount: 0,
    totalPayable: 0
  });

  // Student fee payment state
  const [paymentForm, setPaymentForm] = useState({
    studentId: '',
    installmentNo: 1,
    amount: 0,
    paymentMode: 'online',
    transactionId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/admin/courses');
      setCourses(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotalFee = (fees) => {
    if (!fees) return 0;
    const { tuitionFee = 0, hostelFee = 0, libraryFee = 0, labFee = 0, examFee = 0, otherCharges = 0 } = fees;
    return tuitionFee + hostelFee + libraryFee + labFee + examFee + otherCharges;
  };

  const calculateInstallmentTotal = (installments) => {
    if (!installments) return 0;
    return installments.reduce((total, inst) => total + (inst.amount || 0), 0);
  };

  const handleFeeCalculation = (course) => {
    const baseFee = calculateTotalFee(course.feesStructure);
    const discountAmount = (baseFee * feeCalculation.discountPercent) / 100;
    const taxAmount = ((baseFee - discountAmount) * feeCalculation.taxPercent) / 100;
    const totalPayable = (baseFee - discountAmount + feeCalculation.lateFee + taxAmount);
    
    setFeeCalculation({
      ...feeCalculation,
      baseFee,
      discountAmount,
      taxAmount,
      totalPayable
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate total fee
      const totalFee = calculateTotalFee(courseForm.feesStructure);
      
      // Format installment plan
      const formattedInstallments = courseForm.feesStructure.installmentPlan.map((inst, index) => ({
        ...inst,
        amount: parseInt(inst.amount) || 0,
        dueDate: new Date(inst.dueDate),
        label: inst.label || `Installment ${index + 1}`
      }));

      // Prepare course data
      const courseData = {
        ...courseForm,
        eligibility: courseForm.eligibility.split(',').map(item => item.trim()),
        careerOpportunities: courseForm.careerOpportunities.split(',').map(item => item.trim()),
        feesStructure: {
          ...courseForm.feesStructure,
          totalFee,
          installmentPlan: formattedInstallments
        }
      };

      if (editingCourse) {
        await api.put(`/admin/courses/${editingCourse._id}`, courseData);
        toast.success('Course updated successfully!');
      } else {
        await api.post('/admin/courses', courseData);
        toast.success('Course created successfully!');
      }

      setShowModal(false);
      setEditingCourse(null);
      resetForm();
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCourseForm({
      courseCode: '',
      courseName: '',
      description: '',
      duration: '4 Years',
      eligibility: '',
      seatsAvailable: 60,
      careerOpportunities: '',
      feesStructure: {
        tuitionFee: 50000,
        hostelFee: 20000,
        libraryFee: 5000,
        labFee: 3000,
        examFee: 2000,
        otherCharges: 10000,
        installmentPlan: [
          { installmentNo: 1, amount: 25000, dueDate: '2024-07-15', label: 'First Installment' },
          { installmentNo: 2, amount: 25000, dueDate: '2024-11-15', label: 'Second Installment' }
        ]
      },
      isActive: true
    });
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setCourseForm({
      courseCode: course.courseCode,
      courseName: course.courseName,
      description: course.description,
      duration: course.duration,
      eligibility: course.eligibility.join(', '),
      seatsAvailable: course.seatsAvailable,
      careerOpportunities: course.careerOpportunities.join(', '),
      feesStructure: {
        tuitionFee: course.feesStructure?.tuitionFee || 0,
        hostelFee: course.feesStructure?.hostelFee || 0,
        libraryFee: course.feesStructure?.libraryFee || 0,
        labFee: course.feesStructure?.labFee || 0,
        examFee: course.feesStructure?.examFee || 0,
        otherCharges: course.feesStructure?.otherCharges || 0,
        installmentPlan: course.feesStructure?.installmentPlan || [
          { installmentNo: 1, amount: 0, dueDate: '', label: '' }
        ]
      },
      isActive: course.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;

    try {
      await api.delete(`/admin/courses/${id}`);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete course');
    }
  };

  const toggleCourseStatus = async (course) => {
    try {
      await api.put(`/admin/courses/${course._id}`, {
        isActive: !course.isActive
      });
      toast.success(`Course ${!course.isActive ? 'activated' : 'deactivated'} successfully`);
      fetchCourses();
    } catch (error) {
      toast.error('Failed to update course status');
    }
  };

  const handleFeeModalOpen = (course) => {
    setSelectedCourse(course);
    setFeeCalculation({
      baseFee: calculateTotalFee(course.feesStructure),
      discountPercent: 0,
      discountAmount: 0,
      lateFee: 0,
      taxPercent: 18,
      taxAmount: 0,
      totalPayable: calculateTotalFee(course.feesStructure)
    });
    setShowFeeModal(true);
  };

  const addInstallment = () => {
    setCourseForm(prev => ({
      ...prev,
      feesStructure: {
        ...prev.feesStructure,
        installmentPlan: [
          ...prev.feesStructure.installmentPlan,
          {
            installmentNo: prev.feesStructure.installmentPlan.length + 1,
            amount: 0,
            dueDate: '',
            label: `Installment ${prev.feesStructure.installmentPlan.length + 1}`
          }
        ]
      }
    }));
  };

  const removeInstallment = (index) => {
    const newInstallments = courseForm.feesStructure.installmentPlan.filter((_, i) => i !== index);
    setCourseForm(prev => ({
      ...prev,
      feesStructure: {
        ...prev.feesStructure,
        installmentPlan: newInstallments.map((inst, i) => ({
          ...inst,
          installmentNo: i + 1,
          label: inst.label || `Installment ${i + 1}`
        }))
      }
    }));
  };

  const updateInstallment = (index, field, value) => {
    const newInstallments = [...courseForm.feesStructure.installmentPlan];
    newInstallments[index] = {
      ...newInstallments[index],
      [field]: value
    };
    
    setCourseForm(prev => ({
      ...prev,
      feesStructure: {
        ...prev.feesStructure,
        installmentPlan: newInstallments
      }
    }));
  };

  // Export fee structure
  const exportFeeStructure = (course) => {
    const feeData = {
      courseCode: course.courseCode,
      courseName: course.courseName,
      duration: course.duration,
      feeStructure: course.feesStructure,
      totalFee: calculateTotalFee(course.feesStructure),
      generatedDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(feeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fee-structure-${course.courseCode}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Fee structure exported successfully');
  };

  if (loading && courses.length === 0) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading courses...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-2">Course Management</h2>
          <p className="text-muted mb-0">Manage all courses and their fee structures</p>
        </div>
        <div>
          <Button variant="outline-secondary" className="me-2">
            <FaDownload className="me-2" />
            Export
          </Button>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" />
            Add New Course
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Courses</h6>
                  <h3 className="mb-0">{courses.length}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <FaGraduationCap size={24} className="text-primary" />
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
                  <h6 className="text-muted mb-2">Active Courses</h6>
                  <h3 className="mb-0">{courses.filter(c => c.isActive).length}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <FaUsers size={24} className="text-success" />
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
                  <h6 className="text-muted mb-2">Total Seats</h6>
                  <h3 className="mb-0">
                    {courses.reduce((sum, course) => sum + course.seatsAvailable, 0)}
                  </h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <FaCalendarAlt size={24} className="text-info" />
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
                  <h6 className="text-muted mb-2">Avg. Fee</h6>
                  <h3 className="mb-0">
                    ₹{Math.round(
                      courses.reduce((sum, course) => sum + calculateTotalFee(course.feesStructure), 0) / 
                      (courses.length || 1)
                    ).toLocaleString()}
                  </h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <FaRupeeSign size={24} className="text-warning" /> {/* ✅ Fixed: Using FaRupeeSign */}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search courses by code, name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select>
                <option value="">All Durations</option>
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select>
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Courses Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Course Code</th>
                  <th>Course Details</th>
                  <th>Duration</th>
                  <th>Seats Status</th>
                  <th>Fee Structure</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course._id}>
                    <td>
                      <strong className="d-block">{course.courseCode}</strong>
                      <small className="text-muted">{course.duration}</small>
                    </td>
                    <td>
                      <div>
                        <strong className="d-block">{course.courseName}</strong>
                        <small className="text-muted">{course.description.substring(0, 60)}...</small>
                      </div>
                    </td>
                    <td>
                      <Badge bg="info" className="fs-6">
                        {course.duration}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <div className="d-flex justify-content-between mb-1">
                          <small>Total:</small>
                          <small>{course.seatsAvailable}</small>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <small>Filled:</small>
                          <small>{course.seatsFilled || 0}</small>
                        </div>
                        <div className="progress" style={{ height: '5px' }}>
                          <div 
                            className="progress-bar bg-success" 
                            style={{ 
                              width: `${((course.seatsFilled || 0) / course.seatsAvailable * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <strong className="text-primary">
                          ₹{calculateTotalFee(course.feesStructure).toLocaleString()}
                        </strong>
                        <small className="text-muted">
                          {course.feesStructure?.installmentPlan?.length || 1} Installments
                        </small>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0"
                          onClick={() => handleFeeModalOpen(course)}
                        >
                          <small>View Details</small>
                        </Button>
                      </div>
                    </td>
                    <td>
                      <Badge bg={course.isActive ? 'success' : 'danger'} pill>
                        {course.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleEdit(course)}
                          title="Edit Course"
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => handleFeeModalOpen(course)}
                          title="Fee Calculator"
                        >
                          <FaCalculator />
                        </Button>
                        <Button 
                          variant="outline-warning" 
                          size="sm"
                          onClick={() => toggleCourseStatus(course)}
                          title={course.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {course.isActive ? '🚫' : '✅'}
                        </Button>
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => exportFeeStructure(course)}
                          title="Export Fee Structure"
                        >
                          <FaDownload />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(course._id)}
                          title="Delete Course"
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

          {filteredCourses.length === 0 && (
            <div className="text-center py-5">
              <FaGraduationCap size={48} className="text-muted mb-3" />
              <h5>No courses found</h5>
              <p className="text-muted">Try adjusting your search or add a new course</p>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <FaPlus className="me-2" />
                Add Your First Course
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Course Form Modal */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setEditingCourse(null);
        resetForm();
      }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={courseForm.courseCode}
                    onChange={(e) => setCourseForm({...courseForm, courseCode: e.target.value.toUpperCase()})}
                    placeholder="BSCN-101"
                    required
                    disabled={!!editingCourse}
                  />
                  <Form.Text className="text-muted">Unique course identifier</Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={courseForm.courseName}
                    onChange={(e) => setCourseForm({...courseForm, courseName: e.target.value})}
                    placeholder="B.Sc Nursing"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={courseForm.description}
                onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                placeholder="Detailed course description..."
                required
              />
            </Form.Group>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration *</Form.Label>
                  <Form.Select
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                  >
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="4 Years">4 Years</option>
                    <option value="Diploma 2 Years">Diploma (2 Years)</option>
                    <option value="Degree 4 Years">Degree (4 Years)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Seats Available *</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="500"
                    value={courseForm.seatsAvailable}
                    onChange={(e) => setCourseForm({...courseForm, seatsAvailable: parseInt(e.target.value)})}
                    required
                  />
                  <Form.Text className="text-muted">Maximum number of seats</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Eligibility Criteria (comma separated) *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={courseForm.eligibility}
                onChange={(e) => setCourseForm({...courseForm, eligibility: e.target.value})}
                placeholder="10+2 with Science, Minimum 50% marks, Age 17-25 years..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Career Opportunities (comma separated)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={courseForm.careerOpportunities}
                onChange={(e) => setCourseForm({...courseForm, careerOpportunities: e.target.value})}
                placeholder="Hospital Nurse, Clinical Instructor, Nursing Supervisor, Researcher..."
              />
            </Form.Group>

            {/* Fee Structure Section */}
            <Card className="border mb-3">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Fee Structure (₹)</h6>
                <Badge bg="primary" pill>
                  Total: ₹{calculateTotalFee(courseForm.feesStructure).toLocaleString()}
                </Badge>
              </Card.Header>
              <Card.Body>
                <Row className="g-3 mb-4">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Tuition Fee *</Form.Label>
                      <Form.Control
                        type="number"
                        value={courseForm.feesStructure.tuitionFee}
                        onChange={(e) => setCourseForm({
                          ...courseForm,
                          feesStructure: {
                            ...courseForm.feesStructure,
                            tuitionFee: parseInt(e.target.value) || 0
                          }
                        })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Hostel Fee</Form.Label>
                      <Form.Control
                        type="number"
                        value={courseForm.feesStructure.hostelFee}
                        onChange={(e) => setCourseForm({
                          ...courseForm,
                          feesStructure: {
                            ...courseForm.feesStructure,
                            hostelFee: parseInt(e.target.value) || 0
                          }
                        })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Library Fee</Form.Label>
                      <Form.Control
                        type="number"
                        value={courseForm.feesStructure.libraryFee}
                        onChange={(e) => setCourseForm({
                          ...courseForm,
                          feesStructure: {
                            ...courseForm.feesStructure,
                            libraryFee: parseInt(e.target.value) || 0
                          }
                        })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Lab Fee</Form.Label>
                      <Form.Control
                        type="number"
                        value={courseForm.feesStructure.labFee}
                        onChange={(e) => setCourseForm({
                          ...courseForm,
                          feesStructure: {
                            ...courseForm.feesStructure,
                            labFee: parseInt(e.target.value) || 0
                          }
                        })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Exam Fee</Form.Label>
                      <Form.Control
                        type="number"
                        value={courseForm.feesStructure.examFee}
                        onChange={(e) => setCourseForm({
                          ...courseForm,
                          feesStructure: {
                            ...courseForm.feesStructure,
                            examFee: parseInt(e.target.value) || 0
                          }
                        })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Other Charges</Form.Label>
                      <Form.Control
                        type="number"
                        value={courseForm.feesStructure.otherCharges}
                        onChange={(e) => setCourseForm({
                          ...courseForm,
                          feesStructure: {
                            ...courseForm.feesStructure,
                            otherCharges: parseInt(e.target.value) || 0
                          }
                        })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Installment Plan */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Installment Plan</h6>
                    <Button size="sm" variant="outline-primary" onClick={addInstallment}>
                      <FaPlus /> Add Installment
                    </Button>
                  </div>
                  {courseForm.feesStructure.installmentPlan.map((installment, index) => (
                    <Row key={index} className="g-2 mb-2 align-items-center">
                      <Col md={3}>
                        <Form.Control
                          type="text"
                          value={installment.label}
                          onChange={(e) => updateInstallment(index, 'label', e.target.value)}
                          placeholder="Installment Name"
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Control
                          type="number"
                          value={installment.amount}
                          onChange={(e) => updateInstallment(index, 'amount', e.target.value)}
                          placeholder="Amount"
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Control
                          type="date"
                          value={installment.dueDate}
                          onChange={(e) => updateInstallment(index, 'dueDate', e.target.value)}
                        />
                      </Col>
                      <Col md={3}>
                        {courseForm.feesStructure.installmentPlan.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeInstallment(index)}
                            className="w-100"
                          >
                            <FaTrash />
                          </Button>
                        )}
                      </Col>
                    </Row>
                  ))}
                  <Alert variant="info" className="mt-3">
                    <div className="d-flex justify-content-between">
                      <span>Installment Total:</span>
                      <strong>₹{calculateInstallmentTotal(courseForm.feesStructure.installmentPlan).toLocaleString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                      <span>Course Total:</span>
                      <strong>₹{calculateTotalFee(courseForm.feesStructure).toLocaleString()}</strong>
                    </div>
                    {calculateInstallmentTotal(courseForm.feesStructure.installmentPlan) !== calculateTotalFee(courseForm.feesStructure) && (
                      <small className="text-danger d-block mt-2">
                        ⚠️ Installment total doesn't match course total fee
                      </small>
                    )}
                  </Alert>
                </div>
              </Card.Body>
            </Card>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Activate this course for admissions"
                checked={courseForm.isActive}
                onChange={(e) => setCourseForm({...courseForm, isActive: e.target.checked})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowModal(false);
              setEditingCourse(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : (editingCourse ? 'Update Course' : 'Create Course')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Fee Calculator Modal */}
      <Modal show={showFeeModal} onHide={() => setShowFeeModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCalculator className="me-2" />
            Fee Calculator - {selectedCourse?.courseName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="border">
                    <Card.Body>
                      <h6 className="mb-3">Course Details</h6>
                      <Table size="sm" borderless>
                        <tbody>
                          <tr>
                            <td><strong>Course Code:</strong></td>
                            <td>{selectedCourse.courseCode}</td>
                          </tr>
                          <tr>
                            <td><strong>Course Name:</strong></td>
                            <td>{selectedCourse.courseName}</td>
                          </tr>
                          <tr>
                            <td><strong>Duration:</strong></td>
                            <td>{selectedCourse.duration}</td>
                          </tr>
                          <tr>
                            <td><strong>Base Fee:</strong></td>
                            <td className="text-primary">
                              ₹{calculateTotalFee(selectedCourse.feesStructure).toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border">
                    <Card.Body>
                      <h6 className="mb-3">Fee Components</h6>
                      <Table size="sm" borderless>
                        <tbody>
                          <tr>
                            <td>Tuition Fee:</td>
                            <td className="text-end">₹{selectedCourse.feesStructure?.tuitionFee?.toLocaleString() || 0}</td>
                          </tr>
                          <tr>
                            <td>Hostel Fee:</td>
                            <td className="text-end">₹{selectedCourse.feesStructure?.hostelFee?.toLocaleString() || 0}</td>
                          </tr>
                          <tr>
                            <td>Library Fee:</td>
                            <td className="text-end">₹{selectedCourse.feesStructure?.libraryFee?.toLocaleString() || 0}</td>
                          </tr>
                          <tr>
                            <td>Lab Fee:</td>
                            <td className="text-end">₹{selectedCourse.feesStructure?.labFee?.toLocaleString() || 0}</td>
                          </tr>
                          <tr>
                            <td>Exam Fee:</td>
                            <td className="text-end">₹{selectedCourse.feesStructure?.examFee?.toLocaleString() || 0}</td>
                          </tr>
                          <tr>
                            <td>Other Charges:</td>
                            <td className="text-end">₹{selectedCourse.feesStructure?.otherCharges?.toLocaleString() || 0}</td>
                          </tr>
                          <tr className="border-top">
                            <td><strong>Total:</strong></td>
                            <td className="text-end text-primary">
                              <strong>₹{calculateTotalFee(selectedCourse.feesStructure).toLocaleString()}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Fee Calculator */}
              <Card className="border mb-4">
                <Card.Header className="bg-light">
                  <h6 className="mb-0">Fee Calculator</h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Discount Percentage (%)</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          max="100"
                          value={feeCalculation.discountPercent}
                          onChange={(e) => {
                            const discount = parseFloat(e.target.value) || 0;
                            const base = feeCalculation.baseFee;
                            const discountAmount = (base * discount) / 100;
                            const taxAmount = ((base - discountAmount) * feeCalculation.taxPercent) / 100;
                            setFeeCalculation(prev => ({
                              ...prev,
                              discountPercent: discount,
                              discountAmount,
                              taxAmount,
                              totalPayable: base - discountAmount + prev.lateFee + taxAmount
                            }));
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Late Fee (₹)</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={feeCalculation.lateFee}
                          onChange={(e) => {
                            const lateFee = parseFloat(e.target.value) || 0;
                            setFeeCalculation(prev => ({
                              ...prev,
                              lateFee,
                              totalPayable: prev.baseFee - prev.discountAmount + lateFee + prev.taxAmount
                            }));
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Tax Percentage (%)</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={feeCalculation.taxPercent}
                          onChange={(e) => {
                            const taxPercent = parseFloat(e.target.value) || 0;
                            const taxAmount = ((feeCalculation.baseFee - feeCalculation.discountAmount) * taxPercent) / 100;
                            setFeeCalculation(prev => ({
                              ...prev,
                              taxPercent,
                              taxAmount,
                              totalPayable: prev.baseFee - prev.discountAmount + prev.lateFee + taxAmount
                            }));
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Fee Summary */}
              <Card className="border">
                <Card.Body>
                  <h6 className="mb-3">Fee Summary</h6>
                  <Table borderless>
                    <tbody>
                      <tr>
                        <td>Base Fee:</td>
                        <td className="text-end">₹{feeCalculation.baseFee.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td>Discount ({feeCalculation.discountPercent}%):</td>
                        <td className="text-end text-success">-₹{feeCalculation.discountAmount.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td>Late Fee:</td>
                        <td className="text-end text-danger">+₹{feeCalculation.lateFee.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td>Tax ({feeCalculation.taxPercent}%):</td>
                        <td className="text-end">+₹{feeCalculation.taxAmount.toLocaleString()}</td>
                      </tr>
                      <tr className="border-top">
                        <td><strong>Total Payable:</strong></td>
                        <td className="text-end">
                          <h4 className="text-primary mb-0">
                            ₹{feeCalculation.totalPayable.toLocaleString()}
                          </h4>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFeeModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            navigator.clipboard.writeText(feeCalculation.totalPayable.toString());
            toast.success('Total amount copied to clipboard');
          }}>
            <FaMoneyBillWave className="me-2" />
            Copy Amount
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CourseManagement;