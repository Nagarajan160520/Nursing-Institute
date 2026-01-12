import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Badge, Tabs, Tab, Alert } from 'react-bootstrap';
import { 
  FaClock, 
  FaUserGraduate, 
  FaBook, 
  FaStethoscope, 
  FaMoneyBillWave,
  FaChartLine,
  FaArrowLeft,
  FaDownload
} from 'react-icons/fa';
import api from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data.data.course);
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!course) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>Course Not Found</h4>
          <p>The requested course could not be found.</p>
          <Link to="/courses" className="btn btn-primary">
            <FaArrowLeft className="me-2" />
            Back to Courses
          </Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Back Button */}
      <div className="mb-4">
        <Link to="/courses" className="text-decoration-none d-inline-flex align-items-center">
          <FaArrowLeft className="me-2" />
          Back to Courses
        </Link>
      </div>

      {/* Course Header */}
      <Row className="mb-5">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <Badge bg="primary" className="me-3 fs-6">{course.courseCode}</Badge>
            <Badge bg="success" className="me-3">
              <FaClock className="me-1" />
              {course.duration}
            </Badge>
            <Badge bg="info">
              <FaUserGraduate className="me-1" />
              {course.seatsFilled || 0}/{course.seatsAvailable} Seats
            </Badge>
          </div>
          <h1 className="display-5 fw-bold mb-3">{course.courseName}</h1>
          <p className="lead">{course.description}</p>
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                <Tab eventKey="overview" title="Overview">
                  <div className="py-3">
                    <h4 className="mb-4">Course Overview</h4>
                    <p className="mb-4">{course.description}</p>
                    
                    <h5 className="mb-3">Course Highlights</h5>
                    <Row className="g-3 mb-4">
                      {course.highlights?.map((highlight, index) => (
                        <Col md={6} key={index}>
                          <div className="d-flex align-items-start">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                                 style={{ width: '30px', height: '30px' }}>
                              <FaChartLine size={14} />
                            </div>
                            <p className="mb-0">{highlight}</p>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Tab>

                <Tab eventKey="eligibility" title="Eligibility">
                  <div className="py-3">
                    <h4 className="mb-4">Eligibility Criteria</h4>
                    <ul className="list-group list-group-flush">
                      {course.eligibility?.map((criteria, index) => (
                        <li key={index} className="list-group-item d-flex align-items-center">
                          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style={{ width: '30px', height: '30px' }}>
                            <FaUserGraduate size={14} />
                          </div>
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Tab>

                <Tab eventKey="syllabus" title="Syllabus">
                  <div className="py-3">
                    <h4 className="mb-4">Course Syllabus</h4>
                    {course.subjects && course.subjects.length > 0 ? (
                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th>Subject Code</th>
                            <th>Subject Name</th>
                            <th>Credits</th>
                            <th>Semester</th>
                          </tr>
                        </thead>
                        <tbody>
                          {course.subjects.map((subject, index) => (
                            <tr key={index}>
                              <td>{subject.subjectCode}</td>
                              <td>{subject.subjectName}</td>
                              <td>{subject.credits}</td>
                              <td>{subject.semester}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <p className="text-muted">Syllabus details coming soon...</p>
                    )}
                    
                    {course.syllabus?.pdfUrl && (
                      <div className="mt-4">
                        <Button 
                          href={`http://localhost:5000${course.syllabus.pdfUrl}`} 
                          target="_blank"
                          variant="outline-primary"
                          className="d-inline-flex align-items-center"
                        >
                          <FaDownload className="me-2" />
                          Download Syllabus PDF
                        </Button>
                      </div>
                    )}
                  </div>
                </Tab>

                <Tab eventKey="clinical" title="Clinical Training">
                  <div className="py-3">
                    <h4 className="mb-4">Clinical Training</h4>
                    {course.clinicalTraining ? (
                      <>
                        <p className="mb-4">{course.clinicalTraining.description}</p>
                        
                        <h5 className="mb-3">Associated Hospitals</h5>
                        <Row className="g-3">
                          {course.clinicalTraining.hospitals?.map((hospital, index) => (
                            <Col md={6} key={index}>
                              <Card className="h-100">
                                <Card.Body>
                                  <h6 className="mb-2">{hospital.name}</h6>
                                  <p className="text-muted small mb-2">{hospital.address}</p>
                                  <p className="mb-1">
                                    <strong>Contact:</strong> {hospital.contact}
                                  </p>
                                  <p className="mb-0">
                                    <strong>Duration:</strong> {hospital.duration}
                                  </p>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </>
                    ) : (
                      <p className="text-muted">Clinical training details coming soon...</p>
                    )}
                  </div>
                </Tab>

                <Tab eventKey="careers" title="Career Opportunities">
                  <div className="py-3">
                    <h4 className="mb-4">Career Opportunities</h4>
                    {course.careerOpportunities && course.careerOpportunities.length > 0 ? (
                      <Row className="g-3">
                        {course.careerOpportunities.map((opportunity, index) => (
                          <Col md={6} key={index}>
                            <div className="d-flex align-items-start">
                              <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                                   style={{ width: '30px', height: '30px' }}>
                                <FaStethoscope size={14} />
                              </div>
                              <p className="mb-0">{opportunity}</p>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <p className="text-muted">Career opportunities details coming soon...</p>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Course Stats Card */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="card-title mb-4">Course Statistics</h5>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Seats Available</span>
                  <strong>{course.seatsAvailable - (course.seatsFilled || 0)}</strong>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{ 
                      width: `${((course.seatsFilled || 0) / course.seatsAvailable) * 100}%` 
                    }}
                  ></div>
                </div>
                <small className="text-muted">
                  {course.seatsFilled || 0} of {course.seatsAvailable} seats filled
                </small>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Course Duration</span>
                  <strong>{course.duration}</strong>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Course Type</span>
                  <strong>{course.duration.includes('Year') ? 'Degree' : 'Diploma'}</strong>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Fees Card */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="card-title mb-4">
                <FaMoneyBillWave className="me-2" />
                Fee Structure
              </h5>
              {course.feesStructure ? (
                <div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tuition Fee</span>
                    <strong>₹{course.feesStructure.tuitionFee?.toLocaleString() || 'N/A'}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Hostel Fee</span>
                    <strong>₹{course.feesStructure.hostelFee?.toLocaleString() || 'N/A'}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Other Charges</span>
                    <strong>₹{course.feesStructure.otherCharges?.toLocaleString() || 'N/A'}</strong>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total Fee</strong>
                    <strong className="text-primary">
                      ₹{course.feesStructure.totalFee?.toLocaleString() || 'N/A'}
                    </strong>
                  </div>
                </div>
              ) : (
                <p className="text-muted">Fee structure details coming soon...</p>
              )}
            </Card.Body>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Quick Actions</h5>
              <div className="d-grid gap-2">
                <Button variant="primary" size="lg">
                  Apply Now
                </Button>
                <Button variant="outline-primary" size="lg">
                  Download Brochure
                </Button>
                <Button variant="outline-secondary" size="lg">
                  Contact Counselor
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Admission Process */}
      <Row className="mt-5">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h4 className="mb-4">Admission Process</h4>
              <Row>
                <Col md={3}>
                  <div className="text-center p-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                         style={{ width: '60px', height: '60px' }}>
                      1
                    </div>
                    <h6>Application Form</h6>
                    <p className="small text-muted">Fill online application form</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                         style={{ width: '60px', height: '60px' }}>
                      2
                    </div>
                    <h6>Document Submission</h6>
                    <p className="small text-muted">Submit required documents</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                         style={{ width: '60px', height: '60px' }}>
                      3
                    </div>
                    <h6>Entrance Test</h6>
                    <p className="small text-muted">Appear for entrance test</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                         style={{ width: '60px', height: '60px' }}>
                      4
                    </div>
                    <h6>Admission</h6>
                    <p className="small text-muted">Complete admission formalities</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseDetails;