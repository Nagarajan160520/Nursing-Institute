// src/components/PublicWebsite/Home/Testimonials.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaQuoteLeft, FaStar, FaUserGraduate, FaHospital, FaMapMarkerAlt } from 'react-icons/fa';

const Testimonials = () => {
  const [activeTab, setActiveTab] = useState('students');

  const studentTestimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      course: "B.Sc Nursing",
      batch: "2022-2026",
      rating: 5,
      text: "The clinical training here is exceptional. We get hands-on experience in top hospitals from the very first year.",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      name: "Ravi Kumar",
      course: "GNM",
      batch: "2023-2026",
      rating: 5,
      text: "Faculty members are highly experienced and supportive. The simulation labs helped me gain confidence before actual hospital postings.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      name: "Anjali Patel",
      course: "Post Basic B.Sc",
      batch: "2023-2025",
      rating: 4,
      text: "As a working nurse, this program helped me upgrade my skills. Flexible timing and practical focus made it perfect.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const alumniTestimonials = [
    {
      id: 1,
      name: "Dr. Sunita Reddy",
      position: "Nursing Superintendent",
      hospital: "City General Hospital",
      batch: "2015",
      text: "The foundation I got here prepared me for leadership roles. Still apply the principles I learned.",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      name: "Ajay Verma",
      position: "ICU Head Nurse",
      hospital: "Super Specialty Hospital",
      batch: "2018",
      text: "The critical care training was outstanding. Got placed even before completing the course.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      name: "Meera Krishnan",
      position: "Nurse Educator",
      hospital: "State Medical College",
      batch: "2020",
      text: "Now I'm training the next generation of nurses, thanks to the strong foundation I received.",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const testimonials = activeTab === 'students' ? studentTestimonials : alumniTestimonials;

  return (
    <section className="testimonials py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="display-5 fw-bold mb-3">
              What Our <span style={{ color: '#3498db' }}>Students Say</span>
            </h2>
            <p className="lead text-muted">
              Hear from our students and successful alumni about their journey
            </p>
          </Col>
        </Row>

        {/* Tabs */}
        <div className="text-center mb-5">
          <Button
            variant={activeTab === 'students' ? 'primary' : 'outline-primary'}
            className="mx-2 px-4 py-2"
            onClick={() => setActiveTab('students')}
          >
            <FaUserGraduate className="me-2" />
            Current Students
          </Button>
          <Button
            variant={activeTab === 'alumni' ? 'primary' : 'outline-primary'}
            className="mx-2 px-4 py-2"
            onClick={() => setActiveTab('alumni')}
          >
            <FaHospital className="me-2" />
            Alumni Success
          </Button>
        </div>

        {/* Testimonials Grid */}
        <Row className="g-4">
          {testimonials.map((testimonial) => (
            <Col key={testimonial.id} lg={4} md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ color: '#f39c12', fontSize: '20px' }}>
                    <FaQuoteLeft />
                  </div>
                  
                  <p className="mb-4" style={{ lineHeight: '1.6', color: '#555' }}>
                    "{testimonial.text}"
                  </p>
                  
                  <div className="rating mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i}
                        style={{ 
                          color: i < testimonial.rating ? '#f39c12' : '#ddd',
                          marginRight: '2px'
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="d-flex align-items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginRight: '15px'
                      }}
                    />
                    <div>
                      <h6 className="mb-1" style={{ color: '#2c3e50' }}>
                        {testimonial.name}
                      </h6>
                      <div className="small text-muted">
                        {activeTab === 'students' ? (
                          <>
                            <div>{testimonial.course}</div>
                            <div>Batch: {testimonial.batch}</div>
                          </>
                        ) : (
                          <>
                            <div>{testimonial.position}</div>
                            <div>{testimonial.hospital}</div>
                            <div>Batch: {testimonial.batch}</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Testimonials;