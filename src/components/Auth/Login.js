import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaUser, FaLock, FaUserShield, FaSignInAlt, FaGraduationCap, FaUniversity, FaBook, FaChartLine, FaRocket } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = ({ admin = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef(null);
  const [focusInput, setFocusInput] = useState('');

  // Particle system for background
  const particles = useRef([]);
  const animationId = useRef(null);

  // Initialize particles
  useEffect(() => {
    const initParticles = () => {
      particles.current = [];
      const count = admin ? 80 : 60;
      
      for (let i = 0; i < count; i++) {
        particles.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * (admin ? 6 : 4) + 2,
          speedX: (Math.random() - 0.5) * (admin ? 0.8 : 0.5),
          speedY: (Math.random() - 0.5) * (admin ? 0.8 : 0.5),
          color: admin 
            ? `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 100)}, 255, ${Math.random() * 0.3 + 0.1})`
            : `rgba(255, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 150)}, ${Math.random() * 0.3 + 0.1})`,
          shape: Math.random() > 0.5 ? 'circle' : 'square',
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 2,
          connectionRadius: 150,
        });
      }
    };

    initParticles();
    
    // Handle resize
    const handleResize = () => {
      initParticles();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [admin]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawParticle = (particle) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate((particle.rotation * Math.PI) / 180);
      
      ctx.fillStyle = particle.color;
      
      if (particle.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      }
      
      // Add glow effect
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      ctx.restore();
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const p1 = particles.current[i];
          const p2 = particles.current[j];
          const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
          
          if (distance < p1.connectionRadius) {
            const opacity = 1 - (distance / p1.connectionRadius);
            ctx.strokeStyle = admin 
              ? `rgba(100, 150, 255, ${opacity * 0.2})`
              : `rgba(255, 100, 150, ${opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    };

    const drawGraphicElements = () => {
      // Draw floating geometric shapes
      const time = Date.now() * 0.001;
      
      // Large background circles
      const circles = [
        { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3, radius: 150 },
        { x: window.innerWidth * 0.8, y: window.innerHeight * 0.7, radius: 120 },
        { x: window.innerWidth * 0.4, y: window.innerHeight * 0.8, radius: 100 },
      ];
      
      circles.forEach((circle, index) => {
        const pulse = Math.sin(time + index) * 0.1 + 0.9;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = admin 
          ? `rgba(100, 100, 255, 0.03)`
          : `rgba(255, 100, 150, 0.03)`;
        ctx.fill();
        
        // Border
        ctx.strokeStyle = admin 
          ? `rgba(100, 150, 255, 0.1)`
          : `rgba(255, 100, 200, 0.1)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw data flow lines
      const lines = 8;
      for (let i = 0; i < lines; i++) {
        const angle = (i / lines) * Math.PI * 2 + time * 0.5;
        const startX = window.innerWidth / 2 + Math.cos(angle) * 100;
        const startY = window.innerHeight / 2 + Math.sin(angle) * 100;
        const endX = startX + Math.cos(angle) * 300;
        const endY = startY + Math.sin(angle) * 300;
        
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, admin ? 'rgba(100, 150, 255, 0.1)' : 'rgba(255, 100, 200, 0.1)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Draw moving nodes on lines
        const nodePos = (Math.sin(time * 2 + i) + 1) / 2;
        const nodeX = startX + (endX - startX) * nodePos;
        const nodeY = startY + (endY - startY) * nodePos;
        
        ctx.fillStyle = admin ? 'rgba(100, 200, 255, 0.6)' : 'rgba(255, 150, 200, 0.6)';
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update particles
      particles.current.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;
        
        // Boundary check
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;
        
        drawParticle(particle);
      });
      
      drawConnections();
      drawGraphicElements();
      
      animationId.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [admin]);

  // Floating icons animation
  useEffect(() => {
    const icons = document.querySelectorAll('.floating-icon');
    const intervals = [];

    icons.forEach((icon, index) => {
      const interval = setInterval(() => {
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        const randomRotate = Math.random() * 10 - 5;
        
        icon.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
      }, 3000 + index * 100);
      
      intervals.push(interval);
    });
    
    return () => intervals.forEach(interval => clearInterval(interval));
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      const fadeOut = () => {
        const loginContainer = document.querySelector('.login-container');
        if (loginContainer) {
          loginContainer.style.opacity = '0';
          loginContainer.style.transform = 'scale(0.95)';
        }
      };
      
      fadeOut();
      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'student') {
          navigate('/student');
        }
      }, 500);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      
      // Shake animation
      const form = e.target;
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
      
      return;
    }

    setLoading(true);
    
    // Button click animation
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn) {
      btn.style.transform = 'scale(0.95)';
      btn.style.filter = 'brightness(0.9)';
    }
    
    const result = await login(email, password, admin ? 'admin' : 'student');
    
    setTimeout(() => {
      if (btn) {
        btn.style.transform = 'scale(1)';
        btn.style.filter = 'brightness(1)';
      }
    }, 200);
    
    setLoading(false);
    
    if (result.success) {
      const redirectTo = location.state?.from?.pathname;
      if (redirectTo) {
        navigate(redirectTo);
        return;
      }

      const loggedUser = result.user || user;
      if (loggedUser?.role === 'admin') {
        navigate('/admin');
      } else if (loggedUser?.role === 'student') {
        navigate('/student');
      } else {
        navigate('/');
      }
    } else {
      // Error animation
      const form = e.target.closest('form');
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
    }
  };

  // Inline styles
  const styles = {
    container: {
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: admin 
        ? 'linear-gradient(135deg, #0a0a2a 0%, #1a1a3a 100%)'
        : 'linear-gradient(135deg, #1a0b2e 0%, #2a1b3a 100%)',
    },
    canvas: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1,
    },
    loginContainer: {
      position: 'relative',
      zIndex: 2,
      opacity: 1,
      transform: 'scale(1)',
      transition: 'all 0.5s ease',
    },
    card: {
      border: 'none',
      borderRadius: '20px',
      overflow: 'hidden',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
      transform: 'translateY(0)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    cardHeader: {
      background: admin 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
      padding: '40px 20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    iconWrapper: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 25px',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      position: 'relative',
      overflow: 'hidden',
    },
    iconGlow: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '120%',
      height: '120%',
      background: admin 
        ? 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
        : 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
      filter: 'blur(20px)',
      opacity: 0.5,
    },
    formControl: {
      border: 'none',
      borderBottom: `2px solid ${focusInput === 'email' ? (admin ? '#667eea' : '#f5576c') : '#e0e0e0'}`,
      borderRadius: '0',
      padding: '18px 0',
      background: 'transparent',
      transition: 'all 0.4s ease',
      marginBottom: '25px',
      fontSize: '16px',
    },
    button: {
      background: admin 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      border: 'none',
      borderRadius: '50px',
      padding: '16px',
      fontSize: '16px',
      fontWeight: '600',
      letterSpacing: '1px',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    },
    floatingIcons: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1,
    },
    floatingIcon: {
      position: 'absolute',
      fontSize: '32px',
      color: admin ? 'rgba(102, 126, 234, 0.15)' : 'rgba(245, 87, 108, 0.15)',
      transition: 'all 4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      filter: 'drop-shadow(0 0 10px currentColor)',
    },
    link: {
      color: admin ? '#667eea' : '#f5576c',
      textDecoration: 'none',
      position: 'relative',
      transition: 'all 0.3s ease',
      fontWeight: '500',
      display: 'inline-block',
    },
    inputLabel: {
      color: '#666',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '8px',
      display: 'block',
      transform: focusInput === 'email' ? 'translateY(-5px)' : 'translateY(0)',
      transition: 'all 0.3s ease',
    },
    loadingSpinner: {
      borderWidth: '3px',
    },
    particleText: {
      position: 'absolute',
      fontSize: '120px',
      fontWeight: '900',
      opacity: 0.03,
      color: 'white',
      zIndex: 1,
      userSelect: 'none',
    },
  };

  // Generate floating icons
  const generateFloatingIcons = () => {
    const icons = [
      <FaBook key="book" />,
      <FaChartLine key="chart" />,
      <FaUniversity key="uni" />,
      <FaGraduationCap key="grad" />,
      <FaUserShield key="shield" />,
      <FaRocket key="rocket" />,
    ];
    
    return icons.map((icon, index) => ({
      id: index,
      icon,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: index * 0.5,
    }));
  };

  const floatingIcons = generateFloatingIcons();

  // Create ripple effect
  const createRipple = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple 0.6s linear;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
    `;
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <div style={styles.container} className="login-container">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        style={styles.canvas}
      />
      
      {/* Floating Text Elements */}
      <div style={{ ...styles.particleText, top: '10%', left: '5%' }}>
        {admin ? 'ADMIN' : 'LEARN'}
      </div>
      <div style={{ ...styles.particleText, top: '40%', right: '5%' }}>
        {admin ? 'SYSTEM' : 'GROW'}
      </div>
      <div style={{ ...styles.particleText, bottom: '20%', left: '10%' }}>
        {admin ? 'CONTROL' : 'SUCCESS'}
      </div>

      {/* Floating Icons */}
      <div style={styles.floatingIcons}>
        {floatingIcons.map(item => (
          <div
            key={item.id}
            className="floating-icon"
            style={{
              ...styles.floatingIcon,
              left: `${item.left}%`,
              top: `${item.top}%`,
              animation: `float${item.id % 3} 6s ease-in-out infinite ${item.delay}s`,
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      <Container className="py-5" style={styles.loginContainer}>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={8} lg={6} xl={5}>
            <div 
              style={{
                ...styles.card,
                animation: 'slideUp 0.8s ease-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 35px 70px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3)';
              }}
            >
              {/* Card Header */}
              <div style={styles.cardHeader}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                  animation: 'shimmer 3s infinite linear',
                }} />
                
                <div style={styles.iconWrapper}>
                  <div style={styles.iconGlow} />
                  {admin ? (
                    <FaUserShield size={42} style={{ zIndex: 2, position: 'relative' }} />
                  ) : (
                    <FaGraduationCap size={42} style={{ zIndex: 2, position: 'relative' }} />
                  )}
                </div>
                
                <h3 style={{ 
                  marginBottom: '10px', 
                  fontSize: '32px',
                  fontWeight: '800',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                }}>
                  {admin ? 'ADMIN PORTAL' : 'STUDENT PORTAL'}
                </h3>
                
                <p style={{ 
                  margin: '0', 
                  opacity: '0.9',
                  fontSize: '14px',
                  letterSpacing: '1px',
                  fontWeight: '300',
                }}>
                  {admin 
                    ? 'Secure System Administration Access' 
                    : 'Your Gateway to Academic Excellence'}
                </p>
              </div>

              <Card.Body className="p-4 p-md-5">
                <Form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '30px', position: 'relative' }}>
                    <label style={styles.inputLabel}>
                      <FaUser className="me-2" />
                      Email or Student ID
                    </label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your email or student ID"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusInput('email')}
                      onBlur={() => setFocusInput('')}
                      required
                      style={styles.formControl}
                      className="animated-input"
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: admin 
                        ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
                      transform: focusInput === 'email' ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.4s ease',
                    }} />
                  </div>

                  <div style={{ marginBottom: '40px', position: 'relative' }}>
                    <label style={{
                      ...styles.inputLabel,
                      transform: focusInput === 'password' ? 'translateY(-5px)' : 'translateY(0)',
                    }}>
                      <FaLock className="me-2" />
                      Password
                    </label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusInput('password')}
                      onBlur={() => setFocusInput('')}
                      required
                      style={styles.formControl}
                      className="animated-input"
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: admin 
                        ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
                      transform: focusInput === 'password' ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.4s ease',
                    }} />
                  </div>

                  <Button 
                    type="submit" 
                    style={styles.button}
                    className="w-100 mb-4"
                    disabled={loading}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
                    }}
                    onClick={createRipple}
                  >
                    {loading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <span 
                          className="spinner-border spinner-border-sm me-2" 
                          style={styles.loadingSpinner}
                          role="status" 
                          aria-hidden="true"
                        ></span>
                        {admin ? 'ACCESSING SYSTEM...' : 'AUTHENTICATING...'}
                      </div>
                    ) : (
                      <>
                        <FaSignInAlt className="me-2" />
                        {admin ? 'ENTER ADMIN DASHBOARD' : 'SIGN IN TO CONTINUE'}
                      </>
                    )}
                  </Button>

                  <div className="text-center mt-4">
                    <div className="d-flex justify-content-between align-items-center">
                      {admin ? (
                        <>
                          <Link 
                            to="/login" 
                            style={styles.link}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.color = styles.link.color;
                            }}
                          >
                            ← Student Login
                          </Link>
                          <Link 
                            to="/" 
                            style={styles.link}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.color = styles.link.color;
                            }}
                          >
                            Home →
                          </Link>
                        </>
                      ) : (
                        <>
                          {/*<Link 
                            to="/forgot-password" 
                            style={styles.link}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.color = styles.link.color;
                            }}
                          >
                            Forgot Password?
                          </Link> */}
                          {/*<Link 
                            to="/admin-login" 
                            style={styles.link}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.color = styles.link.color;
                            }}
                          >
                            Admin Login →
                          </Link>*/}
                        </>
                      )}
                    </div>
                  </div>
                </Form>

                {/* Decorative footer */}
                <div style={{
                  textAlign: 'center',
                  marginTop: '40px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '3px',
                    background: admin 
                      ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: '2px',
                  }} />
                  
                  <small style={{ 
                    color: '#666',
                    fontSize: '12px',
                    display: 'block',
                    opacity: 0.7,
                  }}>
                    <FaUniversity className="me-2" />
                    {admin 
                      ? 'Secure System • Encrypted Connection • Activity Logged'
                      : 'Secure Login • Your Data is Protected • 24/7 Access'}
                  </small>
                </div>
              </Card.Body>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Inline CSS Animations */}
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(50px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes float0 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(20px, -20px) rotate(120deg); }
            66% { transform: translate(-15px, 15px) rotate(240deg); }
          }
          
          @keyframes float1 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(-25px, 10px) rotate(-120deg); }
            66% { transform: translate(15px, -15px) rotate(-240deg); }
          }
          
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(15px, 25px) rotate(180deg); }
            66% { transform: translate(-20px, -10px) rotate(360deg); }
          }
          
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
          
          .shake {
            animation: shake 0.5s ease-in-out;
          }
          
          .animated-input:focus {
            outline: none;
            box-shadow: none;
            padding-left: 10px;
          }
          
          .animated-input::placeholder {
            transition: all 0.3s ease;
            opacity: 0.5;
          }
          
          .animated-input:focus::placeholder {
            opacity: 0;
            transform: translateY(-10px);
          }
          
          .floating-icon {
            filter: drop-shadow(0 5px 15px rgba(0,0,0,0.3));
          }
          
          /* Smooth scroll effect for the whole page */
          html {
            scroll-behavior: smooth;
          }
          
          /* Card hover glow effect */
          .hover-glow {
            transition: box-shadow 0.3s ease;
          }
          
          .hover-glow:hover {
            box-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
          }
          
          /* Input focus glow */
          .animated-input:focus {
            background: rgba(255, 255, 255, 0.8);
            border-color: transparent;
          }
        `}
      </style>
    </div>
  );
};

export default Login;