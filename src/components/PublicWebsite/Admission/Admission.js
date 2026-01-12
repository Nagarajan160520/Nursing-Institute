import React from 'react';
import { Container, Row, Col, Card, ListGroup, Accordion, Button } from 'react-bootstrap';
import { 
  FaFileAlt, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaGraduationCap,
  FaCheckCircle,
  FaDownload,
  FaRegClock,
  FaUserGraduate,
  FaBookMedical,
  FaHospital,
  FaArrowRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Admission = () => {
  return (
    <div className="admission-page">
      {/* Hero Section with Background Image */}
      <section 
        className="hero-section py-5"
       style={{
  backgroundImage: `url('https://i.pinimg.com/1200x/3a/90/d3/3a90d30559941683cc55b5e2e3001077.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 
                className="display-4 fw-bold mb-3"
                style={{ 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  color: 'white'
                }}
              >
                Admissions 2024-25
              </h1>
              <p 
                className="lead mb-4"
                style={{ 
                  fontSize: '1.25rem',
                  color: 'rgba(255,255,255,0.9)'
                }}
              >
                Start your journey towards a rewarding career in nursing. 
                Applications are now open for various nursing programs.
              </p>
              <div className="d-flex flex-wrap gap-3" style={{ marginTop: '2rem' }}>
                <Button 
                  as="a" 
                  href="#apply-now" 
                  variant="light" 
                  size="lg"
                  className="fw-bold px-4 py-3"
                  style={{ 
                    borderRadius: '10px',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                >
                  <FaArrowRight className="me-2" />
                  Apply Now
                </Button>
                <Button 
                  as={Link} 
                  to="/courses" 
                  variant="outline-light" 
                  size="lg"
                  className="px-4 py-3"
                  style={{ 
                    borderRadius: '10px',
                    fontSize: '1.1rem',
                    borderWidth: '2px'
                  }}
                >
                  <FaGraduationCap className="me-2" />
                  Explore Courses
                </Button>
              </div>
            </Col>
           
          </Row>
        </Container>
      </section>

      {/* Floating Animation CSS */}
      <style jsx="true">{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      {/* Main Content - NO Background Image Here */}
      <Container className="py-5">
        {/* Admission Process Cards */}
        <Row className="mb-5">
          <Col>
            <h2 
              className="text-center mb-4"
              style={{ 
                color: '#2c3e50',
                fontWeight: '700',
                position: 'relative',
                paddingBottom: '15px'
              }}
            >
              Admission Process
              <div 
                style={{
                  position: 'absolute',
                  bottom: '0',
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
              className="text-center mb-5"
              style={{ 
                color: '#7f8c8d',
                fontSize: '1.1rem',
                maxWidth: '700px',
                margin: '0 auto'
              }}
            >
              Follow these simple steps to secure your seat in our nursing programs
            </p>
          </Col>
        </Row>

        <Row className="g-4 mb-5">
          {[
            {
              step: '01',
              title: 'Check Eligibility',
              icon: <FaCheckCircle />,
              description: 'Verify if you meet the minimum requirements for your chosen course',
              color: '#e74c3c'
            },
            {
              step: '02',
              title: 'Fill Application',
              icon: <FaFileAlt />,
              description: 'Complete the online application form with accurate details',
              color: '#3498db'
            },
            {
              step: '03',
              title: 'Submit Documents',
              icon: <FaDownload />,
              description: 'Upload required documents for verification',
              color: '#2ecc71'
            },
            {
              step: '04',
              title: 'Pay Fees',
              icon: <FaMoneyBillWave />,
              description: 'Pay the application and admission fees online',
              color: '#f39c12'
            }
          ].map((item, index) => (
            <Col md={6} lg={3} key={index}>
              <div 
                className="h-100"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '30px 25px',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                  borderTop: `5px solid ${item.color}`,
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
                }}
              >
                <div 
                  className="mb-4 text-center"
                  style={{
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}
                >
                  {item.step}
                </div>
                <div 
                  className="text-center mb-3"
                  style={{ 
                    fontSize: '40px',
                    color: item.color 
                  }}
                >
                  {item.icon}
                </div>
                <h5 
                  className="text-center mb-3"
                  style={{ 
                    color: '#2c3e50',
                    fontWeight: '600'
                  }}
                >
                  {item.title}
                </h5>
                <p 
                  className="text-center flex-grow-1"
                  style={{ 
                    color: '#7f8c8d',
                    lineHeight: '1.6'
                  }}
                >
                  {item.description}
                </p>
              </div>
            </Col>
          ))}
        </Row>

        {/* Important Dates Section */}
        <Row className="mb-5">
          <Col>
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '40px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                border: '1px solid #eaeaea'
              }}
            >
              <div 
                className="d-flex align-items-center mb-4"
                style={{ 
                  borderBottom: '2px solid #3498db',
                  paddingBottom: '15px'
                }}
              >
                <FaCalendarAlt 
                  style={{ 
                    color: '#3498db',
                    marginRight: '15px',
                    fontSize: '28px'
                  }} 
                />
                <h3 
                  style={{ 
                    color: '#2c3e50',
                    margin: '0',
                    fontWeight: '700'
                  }}
                >
                  Important Dates
                </h3>
              </div>
              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    {[
                      { label: 'Application Start Date', date: '1st March 2024' },
                      { label: 'Last Date for Application', date: '30th April 2024' },
                      { label: 'Entrance Test (if applicable)', date: '15th May 2024' }
                    ].map((item, idx) => (
                      <ListGroup.Item 
                        key={idx}
                        style={{
                          borderBottom: '1px solid #eee',
                          padding: '15px 0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ color: '#34495e' }}>{item.label}</span>
                        <strong 
                          style={{ 
                            color: '#3498db',
                            fontSize: '16px'
                          }}
                        >
                          {item.date}
                        </strong>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    {[
                      { label: 'Merit List Publication', date: '25th May 2024' },
                      { label: 'Counselling Date', date: '5th June 2024' },
                      { label: 'Class Commencement', date: '1st July 2024' }
                    ].map((item, idx) => (
                      <ListGroup.Item 
                        key={idx}
                        style={{
                          borderBottom: '1px solid #eee',
                          padding: '15px 0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ color: '#34495e' }}>{item.label}</span>
                        <strong 
                          style={{ 
                            color: '#3498db',
                            fontSize: '16px'
                          }}
                        >
                          {item.date}
                        </strong>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Documents Required Section */}
        <Row className="mb-5">
          <Col>
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '40px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
              }}
            >
              <div 
                className="d-flex align-items-center mb-4"
                style={{ 
                  borderBottom: '2px solid #3498db',
                  paddingBottom: '15px'
                }}
              >
                <FaFileAlt 
                  style={{ 
                    color: '#3498db',
                    marginRight: '15px',
                    fontSize: '28px'
                  }} 
                />
                <h3 
                  style={{ 
                    color: '#2c3e50',
                    margin: '0',
                    fontWeight: '700'
                  }}
                >
                  Required Documents
                </h3>
              </div>
              
              <div className="mt-4">
                {[
                  {
                    title: 'Educational Documents',
                    iconColor: '#e74c3c',
                    items: [
                      '10th Marksheet & Certificate (Original + 3 copies)',
                      '12th Marksheet & Certificate (Original + 3 copies)',
                      'Transfer Certificate from last institution',
                      'Migration Certificate (if applicable)',
                      'Gap Certificate (if applicable)'
                    ]
                  },
                  {
                    title: 'Identity & Personal Documents',
                    iconColor: '#3498db',
                    items: [
                      'Aadhar Card (3 copies)',
                      'PAN Card (1 copy)',
                      'Passport Size Photos (8 copies)',
                      'Domicile Certificate',
                      'Caste Certificate (SC/ST/OBC)',
                      'Income Certificate (if applicable)'
                    ]
                  },
                  {
                    title: 'Medical Documents',
                    iconColor: '#2ecc71',
                    items: [
                      'Medical Fitness Certificate',
                      'Blood Group Certificate',
                      'COVID Vaccination Certificate',
                      'HIV Test Report (for nursing courses)'
                    ]
                  }
                ].map((section, idx) => (
                  <div 
                    key={idx}
                    style={{
                      marginBottom: '20px',
                      border: '1px solid #eee',
                      borderRadius: '10px',
                      overflow: 'hidden'
                    }}
                  >
                    <div 
                      style={{
                        backgroundColor: `${section.iconColor}15`,
                        padding: '15px 20px',
                        borderLeft: `4px solid ${section.iconColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        const content = e.currentTarget.nextElementSibling;
                        content.style.display = content.style.display === 'none' ? 'block' : 'none';
                      }}
                    >
                      <strong style={{ color: '#2c3e50', flexGrow: 1 }}>
                        {section.title}
                      </strong>
                      <span style={{ color: section.iconColor }}>
                        ▼
                      </span>
                    </div>
                    <div 
                      style={{
                        padding: '20px',
                        backgroundColor: '#fafafa',
                        display: 'block'
                      }}
                    >
                      {section.items.map((item, itemIdx) => (
                        <div 
                          key={itemIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px',
                            color: '#555'
                          }}
                        >
                          <FaCheckCircle 
                            style={{ 
                              color: section.iconColor,
                              marginRight: '10px',
                              minWidth: '20px'
                            }} 
                          />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* Fee Structure Section */}
        <Row className="mb-5">
          <Col>
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '40px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
              }}
            >
              <div 
                className="d-flex align-items-center mb-4"
                style={{ 
                  borderBottom: '2px solid #3498db',
                  paddingBottom: '15px'
                }}
              >
                <FaMoneyBillWave 
                  style={{ 
                    color: '#3498db',
                    marginRight: '15px',
                    fontSize: '28px'
                  }} 
                />
                <h3 
                  style={{ 
                    color: '#2c3e50',
                    margin: '0',
                    fontWeight: '700'
                  }}
                >
                  Fee Structure (Per Year)
                </h3>
              </div>
              
              <div 
                className="table-responsive"
                style={{ 
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid #eaeaea'
                }}
              >
                <table 
                  className="table table-hover mb-0"
                  style={{ 
                    marginBottom: '0',
                    borderCollapse: 'collapse'
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#3498db', color: 'white' }}>
                      <th style={{ padding: '15px', border: 'none' }}>Course</th>
                      <th style={{ padding: '15px', border: 'none' }}>Tuition Fee</th>
                      <th style={{ padding: '15px', border: 'none' }}>Hostel Fee</th>
                      <th style={{ padding: '15px', border: 'none' }}>Other Charges</th>
                      <th style={{ padding: '15px', border: 'none' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['GNM (General Nursing & Midwifery)', '₹35,000', '₹25,000', '₹10,000', '₹70,000'],
                      ['ANM (Auxiliary Nurse Midwife)', '₹25,000', '₹25,000', '₹8,000', '₹58,000'],
                      ['B.Sc Nursing', '₹60,000', '₹25,000', '₹15,000', '₹1,00,000'],
                      ['Post Basic B.Sc Nursing', '₹45,000', '₹25,000', '₹12,000', '₹82,000']
                    ].map((row, idx) => (
                      <tr 
                        key={idx}
                        style={{ 
                          borderBottom: '1px solid #eee',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        {row.map((cell, cellIdx) => (
                          <td 
                            key={cellIdx}
                            style={{ 
                              padding: '15px',
                              color: cellIdx === 4 ? '#2c3e50' : '#555',
                              fontWeight: cellIdx === 4 ? 'bold' : 'normal',
                              border: 'none'
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div 
                style={{
                  marginTop: '20px',
                  padding: '15px',
                  backgroundColor: '#e8f4fc',
                  borderRadius: '8px',
                  borderLeft: '4px solid #3498db',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <FaRegClock 
                  style={{ 
                    color: '#3498db',
                    marginRight: '10px',
                    fontSize: '20px'
                  }} 
                />
                <div>
                  <strong style={{ color: '#2c3e50' }}>Note:</strong>
                  <span style={{ color: '#555', marginLeft: '5px' }}>
                    Fees can be paid in installments. Scholarship available for meritorious and needy students.
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Apply Now Section */}
        <Row id="apply-now">
          <Col>
            <div 
              style={{
                background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                borderRadius: '20px',
                padding: '60px 40px',
                color: 'white',
                boxShadow: '0 10px 40px rgba(52, 152, 219, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Decorative Elements */}
              <div 
                style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '200px',
                  height: '200px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%'
                }}
              ></div>
              <div 
                style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-30px',
                  width: '150px',
                  height: '150px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '50%'
                }}
              ></div>
              
              <Row className="align-items-center position-relative" style={{ zIndex: 1 }}>
                <Col lg={8}>
                  <h2 
                    className="mb-3"
                    style={{ 
                      fontWeight: '800',
                      fontSize: '2.5rem',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    Ready to Start Your Nursing Career?
                  </h2>
                  <p 
                    className="mb-4"
                    style={{ 
                      fontSize: '1.1rem',
                      color: 'rgba(255,255,255,0.9)',
                      maxWidth: '600px'
                    }}
                  >
                    Join hundreds of successful nursing professionals who started their journey with us.
                    Limited seats available for 2024-25 batch!
                  </p>
                  <div className="d-flex flex-wrap gap-3">
                    <Button 
                      as="a" 
                      href="#" 
                      variant="light" 
                      size="lg"
                      style={{ 
                        fontWeight: '700',
                        padding: '12px 30px',
                        borderRadius: '10px',
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      }}
                    >
                      <FaArrowRight className="me-2" />
                      Apply Online Now
                    </Button>
                    <Button 
                      as={Link} 
                      to="/contact" 
                      variant="outline-light" 
                      size="lg"
                      style={{ 
                        padding: '12px 30px',
                        borderRadius: '10px',
                        fontSize: '1.1rem',
                        borderWidth: '2px'
                      }}
                    >
                      <FaBookMedical className="me-2" />
                      Contact Admission Cell
                    </Button>
                  </div>
                </Col>
                <Col lg={4} className="text-center mt-4 mt-lg-0">
                  <FaBookMedical 
                    size={120} 
                    style={{ 
                      color: 'rgba(255,255,255,0.7)',
                      filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))'
                    }} 
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Admission;