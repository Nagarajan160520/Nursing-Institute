import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { 
  FaGraduationCap, 
  FaStethoscope, 
  FaUserMd, 
  FaBriefcase,
  FaAward,
  FaUsers,
  FaArrowRight
} from 'react-icons/fa';
import api from '../../../services/api';

const HeroSection = () => {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    faculty: 0,
    placement: 0
  });
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const intervalRef = useRef(null);

  // Full-screen carousel images
  const carouselImages = [
    {
      url: "https://i.pinimg.com/1200x/8c/6a/84/8c6a8477651aba1ace84c25bea19e45e.jpg",
      title: "World-Class Nursing Education",
      subtitle: "State-of-the-art simulation labs and training facilities"
    },
    {
      url: "https://i.pinimg.com/736x/6a/0d/4e/6a0d4e02ade464ef7399a3c693fc252a.jpg",
      title: "Clinical Excellence",
      subtitle: "Hands-on training at affiliated hospitals"
    },
    {
      url: "https://i.pinimg.com/736x/b2/a9/fe/b2a9fe14e2a3bbac780fb698efc68ddf.jpg",
      title: "Expert Faculty",
      subtitle: "Learn from experienced nursing professionals"
    },
    {
      url: "https://i.pinimg.com/736x/b3/e3/34/b3e334466c2093160b38ad5d1c44c732.jpg",
      title: "Modern Infrastructure",
      subtitle: "Advanced learning environment with latest technology"
    },
    {
      url: "https://i.pinimg.com/736x/a6/49/aa/a649aa6ad85d2d07cd051acdcad65525.jpg",
      title: "Student Success",
      subtitle: "98% placement record with top healthcare institutions"
    },
    {
      url: "https://i.pinimg.com/1200x/e2/9b/17/e29b176e9081c4744df62fc8172cb0ba.jpg",
      title: "Research & Innovation",
      subtitle: "Contributing to healthcare advancement through research"
    }
  ];

  // Feature cards
  const features = [
    {
      icon: <FaGraduationCap />,
      title: "25+ Years Excellence",
      description: "Pioneer in nursing education since 1998",
      color: "#4CAF50"
    },
    {
      icon: <FaStethoscope />,
      title: "Modern Labs",
      description: "Advanced simulation and practical training labs",
      color: "#2196F3"
    },
    {
      icon: <FaUserMd />,
      title: "Expert Faculty",
      description: "Highly qualified teaching professionals",
      color: "#FF9800"
    },
    {
      icon: <FaBriefcase />,
      title: "100% Placement",
      description: "Excellent placement assistance",
      color: "#9C27B0"
    }
  ];

  useEffect(() => {
    fetchStats();
    startCarousel();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/public/home');
      if (response.data.data.stats) {
        setStats({
          students: response.data.data.stats.totalStudents || 1268,
          courses: response.data.data.stats.totalCourses || 12,
          faculty: response.data.data.stats.totalFaculty || 25,
          placement: response.data.data.stats.placementRate || 98
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        students: 1268,
        courses: 12,
        faculty: 25,
        placement: 98
      });
    }
  };

  const startCarousel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      // Start fade out
      setFadeIn(false);
      
      // Wait for fade out to complete, then change image
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
        );
        
        // Fade in new image
        setFadeIn(true);
      }, 200); // Wait 500ms for fade out
      
    }, 5000); // Change image every 5 seconds
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Full Screen Automatic Carousel */}
      <div 
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        {/* Carousel Images with Automatic Transitions */}
        {carouselImages.map((image, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === currentImageIndex ? (fadeIn ? 1 : 0) : 0,
              transition: 'opacity 0.8s ease-in-out',
              backgroundImage: `linear-gradient(rgba(14, 14, 14, 0.6), rgba(20, 169, 228, 0.4)), url(${image.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ))}

        {/* Dark Overlay for better text visibility */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)'
        }} />

        {/* Content Container */}
        <Container 
          style={{ 
            height: '100%',
            position: 'relative',
            zIndex: 10 
          }}
        >
          <Row className="h-100 align-items-center">
            {/* Left Content */}
            <Col lg={7} className="text-white">
              <div style={{
                opacity: fadeIn ? 1 : 0.8,
                transform: fadeIn ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.8s ease'
              }}>
                {/* Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'rgba(255, 152, 0, 0.9)',
                  padding: '8px 20px',
                  borderRadius: '50px',
                  marginBottom: '30px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)'
                }}>
                  <FaAward style={{ marginRight: '8px' }} />
                  Ranked #1 Nursing Institute • Est. 1998
                </div>

                {/* Main Title */}
                <h1 style={{
                  fontSize: '4rem',
                  fontWeight: '800',
                  lineHeight: '1.1',
                  marginBottom: '25px',
                  textShadow: '2px 2px 10px rgba(0,0,0,0.3)'
                }}>
                  Shaping the Future of <br />
                  <span style={{ 
                    color: '#ffcc80',
                    background: 'linear-gradient(45deg, #ffcc80, #ffb74d)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Healthcare Leadership
                  </span>
                </h1>

                {/* Dynamic Title based on current image */}
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '15px',
                  opacity: 0.95,
                  minHeight: '60px',
                  transition: 'opacity 0.5s ease'
                }}>
                  {carouselImages[currentImageIndex].title}
                </h2>

                {/* Dynamic Subtitle based on current image */}
                <p style={{
                  fontSize: '1.2rem',
                  lineHeight: '1.6',
                  marginBottom: '40px',
                  maxWidth: '600px',
                  opacity: 0.9,
                  minHeight: '80px',
                  transition: 'opacity 0.5s ease'
                }}>
                  {carouselImages[currentImageIndex].subtitle}
                </p>

                {/* CTA Buttons */}
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '20px',
                  marginBottom: '50px'
                }}>
                  <Button 
                    as={Link} 
                    to="/courses" 
                    style={{
                      background: 'linear-gradient(45deg, #ff9800, #ffb74d)',
                      border: 'none',
                      padding: '18px 40px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      borderRadius: '50px',
                      boxShadow: '0 10px 30px rgba(255, 152, 0, 0.3)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 15px 35px rgba(255, 152, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 10px 30px rgba(255, 152, 0, 0.3)';
                    }}
                  >
                    <FaGraduationCap />
                    Explore All Courses
                    <FaArrowRight />
                  </Button>
                  
                  <Button 
                    as={Link} 
                    to="/contact" 
                    variant="outline-light" 
                    style={{
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      padding: '18px 36px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      borderRadius: '50px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                      e.target.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Schedule Campus Visit
                  </Button>
                </div>

                {/* Stats - These remain static */}
                <Row className="g-4">
                  {features.map((feature, index) => (
                    <Col key={index} xs={6} md={3}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        opacity: 0.9,
                        transition: 'opacity 0.5s ease'
                      }}>
                        <div style={{
                          background: feature.color,
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                        }}>
                          {feature.icon}
                        </div>
                        <div>
                          <h3 style={{
                            margin: '0',
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            color: '#fff'
                          }}>
                            {index === 0 ? stats.students + '+' :
                             index === 1 ? stats.courses :
                             index === 2 ? stats.faculty + '+' :
                             stats.placement + '%'}
                          </h3>
                          <p style={{
                            margin: '0',
                            fontSize: '0.9rem',
                            opacity: 0.9
                          }}>
                            {feature.title}
                          </p>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>

        {/* Auto-Transition Indicator (Visual only) */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.9rem',
          fontFamily: 'monospace'
        }}>
          {/* Current Image Number */}
          <div style={{
            padding: '5px 15px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '20px',
            backdropFilter: 'blur(5px)'
          }}>
            Image {currentImageIndex + 1} of {carouselImages.length}
          </div>
          
          {/* Auto Transition Indicator */}
          <div style={{
            padding: '5px 15px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '20px',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              
              animation: 'pulse 1.5s infinite'
            }} />
            
          </div>
        </div>

        {/* Transition Progress Bar */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '100%',
          height: '3px',
          background: 'rgba(255, 255, 255, 0.1)'
        }}>
          <div 
            style={{
              height: '100%',
              width: '100%',
              background: 'linear-gradient(90deg, transparent, #ff9800, transparent)',
              animation: 'slide 5s linear infinite'
            }}
          />
        </div>
      </div>

      {/* Features Section (Below Hero) */}
      <section style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        padding: '100px 0',
        position: 'relative',
        zIndex: 1
      }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{ 
              color: '#1a237e',
              fontSize: '2.8rem',
              fontWeight: '700',
              marginBottom: '20px'
            }}>
              Why Choose Us?
            </h2>
            <p style={{ 
              color: '#666',
              fontSize: '1.2rem',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Discover what makes us the preferred choice for nursing education
            </p>
          </div>
          
          <Row className="g-5">
            {features.map((feature, index) => (
              <Col key={index} lg={3} md={6}>
                <div style={{
                  background: 'white',
                  padding: '40px 30px',
                  borderRadius: '20px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                  height: '100%',
                  transition: 'all 0.4s ease',
                  textAlign: 'center',
                  borderTop: `5px solid ${feature.color}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-15px)';
                  e.target.style.boxShadow = '0 20px 50px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
                }}>
                  <div style={{
                    fontSize: '3.5rem',
                    color: feature.color,
                    marginBottom: '25px'
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{
                    color: '#1a237e',
                    marginBottom: '15px',
                    fontWeight: '600',
                    fontSize: '1.5rem'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    color: '#666',
                    margin: '0',
                    lineHeight: '1.7',
                    fontSize: '1rem'
                  }}>
                    {feature.description}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Global Styles for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(0.95);
          }
        }
        
        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }
        
        @media (max-width: 1200px) {
          .hero-content h1 {
            font-size: 3.2rem !important;
          }
        }
        
        @media (max-width: 992px) {
          .hero-content h1 {
            font-size: 2.8rem !important;
          }
          
          .hero-content {
            text-align: center;
          }
          
          .hero-content p {
            margin: 0 auto 30px !important;
          }
        }
        
        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2.2rem !important;
          }
          
          .hero-content h2 {
            font-size: 1.4rem !important;
          }
          
          .hero-content p {
            font-size: 1rem !important;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .cta-buttons button {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }
          
          .transition-indicator {
            flex-direction: column;
            gap: 10px !important;
            bottom: 20px !important;
          }
        }
        
        @media (max-width: 576px) {
          .hero-content h1 {
            font-size: 1.8rem !important;
          }
          
          .hero-stats {
            flex-direction: column;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;