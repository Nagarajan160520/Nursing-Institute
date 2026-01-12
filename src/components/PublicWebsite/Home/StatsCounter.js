import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUsers, FaGraduationCap, FaUserTie, FaBriefcase } from 'react-icons/fa';

const StatsCounter = () => {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    faculty: 0,
    placement: 0
  });

  useEffect(() => {
    // Simulate counting animation
    const timer = setTimeout(() => {
      setStats({
        students: 500,
        courses: 8,
        faculty: 50,
        placement: 95
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const statItems = [
    {
      icon: <FaUsers size={40} />,
      value: stats.students,
      label: 'Students Trained',
      suffix: '+',
      color: 'primary'
    },
    {
      icon: <FaGraduationCap size={40} />,
      value: stats.courses,
      label: 'Courses Offered',
      color: 'success'
    },
    {
      icon: <FaUserTie size={40} />,
      value: stats.faculty,
      label: 'Expert Faculty',
      suffix: '+',
      color: 'warning'
    },
    {
      icon: <FaBriefcase size={40} />,
      value: stats.placement,
      label: 'Placement Rate',
      suffix: '%',
      color: 'info'
    }
  ];

  return (
    <section className="py-5 bg-light">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-primary">Our Achievements</h2>
          <p className="lead text-muted">
            Years of excellence in nursing education and healthcare training
          </p>
        </div>
        
        <Row className="g-4">
          {statItems.map((item, index) => (
            <Col key={index} xs={12} sm={6} lg={3}>
              <div className="text-center p-4">
                <div className={`text-${item.color} mb-3`}>
                  {item.icon}
                </div>
                <h2 className="fw-bold display-6 mb-2">
                  {item.value}
                  {item.suffix && <span>{item.suffix}</span>}
                </h2>
                <h5 className="text-muted">{item.label}</h5>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default StatsCounter;