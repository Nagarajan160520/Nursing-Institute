import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  FaHome,
  FaInfoCircle,
  FaGraduationCap,
  FaImages,
  FaPhoneAlt,
  FaUser,
  FaUserShield,
  FaSignInAlt,
  FaPhone,
  FaPhoneVolume,
  FaClock,
  FaEnvelope,
  FaWhatsapp,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';

const PublicNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pulsePhone, setPulsePhone] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLoginButton, setShowLoginButton] = useState(true);

  // Institute contact details
  const contactInfo = {
    phone: '+91 6381095854',
    whatsapp: '+91 6381095854',
    email: 'info@nursinginstitute.edu',
    emergency: '+91 6381095854',
    timing: 'Mon-Sat: 9:00 AM - 6:00 PM',
    address: '123 Medical Street, Healthcare City'
  };

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check screen width for mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setShowLoginButton(window.innerWidth > 991);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Nav links
  const navLinks = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/about', label: 'About', icon: <FaInfoCircle /> },
    { path: '/courses', label: 'Courses', icon: <FaGraduationCap /> },
    { path: '/gallery', label: 'Gallery', icon: <FaImages /> },
    { path: '/Admission', label: 'Admission', icon: <FaGraduationCap /> },
    { path: '/contact', label: 'Contact', icon: <FaPhoneAlt /> },
  ];

  // Handle phone call
  const handlePhoneCall = () => {
    setPulsePhone(true);
    const phoneNumber = contactInfo.phone.replace(/[\s\-]/g, '');
    window.location.href = `tel:${phoneNumber}`;
    setTimeout(() => setPulsePhone(false), 1000);
  };

  // Handle WhatsApp
  const handleWhatsApp = () => {
    const message = `Hello Nursing Institute, I need information about:`;
    const whatsappNumber = contactInfo.whatsapp.replace(/[\s\-]/g, '');
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Inline styles
  const styles = {
    navbar: {
      background: isScrolled 
        ? 'linear-gradient(135deg, rgba(21, 101, 192, 0.98) 0%, rgba(13, 71, 161, 0.98) 100%)'
        : 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
      transition: 'all 0.3s ease',
      boxShadow: isScrolled 
        ? '0 8px 32px rgba(0, 0, 0, 0.3)'
        : '0 4px 20px rgba(0, 0, 0, 0.1)',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: isScrolled ? '5px 0' : '10px 0',
    },
    logoGlow: {
      filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
      animation: 'logoFloat 3s ease-in-out infinite',
      borderRadius: '10px',
      border: '2px solid rgba(255, 255, 255, 0.1)',
    },
    navLink: {
      position: 'relative',
      padding: '8px 16px',
      margin: '0 4px',
      borderRadius: '25px',
      transition: 'all 0.3s ease',
      color: 'white',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    activeLink: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
    },
    phoneButton: {
      background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
      border: 'none',
      borderRadius: '50px',
      padding: '10px 20px',
      color: 'white',
      fontWeight: '600',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      animation: pulsePhone ? 'phonePulse 0.5s ease' : 'none',
    },
    phoneGlow: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '0',
      height: '0',
      borderRadius: '50%',
      background: 'rgba(76, 175, 80, 0.3)',
      animation: 'ripple 1s ease-out',
    },
    contactDropdown: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '15px',
      padding: '20px',
      minWidth: '300px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      transformOrigin: 'top right',
      animation: showContactDropdown ? 'dropdownSlide 0.3s ease' : 'none',
    },
    contactItem: {
      padding: '12px 16px',
      borderRadius: '10px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px',
      border: '1px solid transparent',
    },
    contactItemHover: {
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
      transform: 'translateX(5px)',
      borderColor: '#1565C0',
    },
    mobileMenu: {
      position: 'fixed',
      top: '70px',
      right: isMobileMenuOpen ? '0' : '-100%',
      width: '85%',
      maxWidth: '350px',
      height: 'calc(100vh - 70px)',
      background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
      transition: 'right 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.3)',
      padding: '20px',
      zIndex: 999,
      overflowY: 'auto',
    },
    timeDisplay: {
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    badge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      background: '#FF4081',
      color: 'white',
      fontSize: '10px',
      padding: '2px 6px',
      borderRadius: '10px',
      animation: 'badgePulse 2s infinite',
    },
    mobileLoginButton: {
      background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
      border: 'none',
      borderRadius: '50px',
      padding: '12px 24px',
      color: 'white',
      fontWeight: '600',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '20px',
      width: '100%',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
    },
    mobileUserProfile: {
      background: 'rgba(255, 255, 255, 0.15)',
      borderRadius: '15px',
      padding: '15px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
  };

  return (
    <>
      {/* Main Navbar */}
      <Navbar 
        expand="lg" 
        style={styles.navbar}
        className="shadow-sm"
        sticky="top"
      >
        <Container>
          {/* Logo with Animation */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 gap-md-3">
            <div style={{ position: 'relative' }}>
              <img 
                src="https://i.pinimg.com/1200x/97/22/fd/9722fdba371b978daf9fc7368436a5e8.jpg" 
                alt="Nursing Institute Logo" 
                height="45"
                width="45"
                className="me-1 me-md-2"
                style={styles.logoGlow}
              />
              <div style={styles.badge}>
                <FaClock size={8} /> {formatTime(currentTime)}
              </div>
            </div>
            <div>
              <h5 className="mb-0 text-white d-none d-md-block" style={{ 
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '0.5px',
                fontSize: '18px'
              }}>
                Nursing Institute
              </h5>
              <h6 className="mb-0 text-white d-md-none" style={{ 
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '0.5px',
                fontSize: '16px'
              }}>
                Nursing Institute
              </h6>
              <small className="text-light d-none d-md-block" style={{ 
                opacity: 0.9,
                fontSize: '12px',
                letterSpacing: '0.5px'
              }}>
                Excellence in Healthcare Education
              </small>
            </div>
          </Navbar.Brand>

          {/* Mobile Menu Toggle */}
          <div className="d-flex align-items-center gap-2 d-lg-none">
            {/* Mobile Login Button (Visible when user is not logged in) */}
            {!user && (
              <Link 
                to="/login" 
                className="d-lg-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50px',
                  padding: '6px 12px',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  textDecoration: 'none',
                  marginRight: '10px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#1565C0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.color = 'white';
                }}
              >
                <FaSignInAlt size={12} />
                <span>Login</span>
              </Link>
            )}
            
            <Button
              variant="link"
              className="text-white p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                border: 'none',
                fontSize: '22px',
                position: 'relative',
                zIndex: 1001,
                minWidth: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </Button>
          </div>

          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between d-none d-lg-flex">
            {/* Navigation Links */}
            <Nav className="mx-3">
              {navLinks.map((link) => (
                <Nav.Link
                  key={link.path}
                  as={Link}
                  to={link.path}
                  style={{
                    ...styles.navLink,
                    ...(location.pathname === link.path ? styles.activeLink : {})
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.path) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== link.path) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <span style={{ 
                    transition: 'transform 0.3s ease',
                    transform: location.pathname === link.path ? 'scale(1.2)' : 'scale(1)'
                  }}>
                    {link.icon}
                  </span>
                  {link.label}
                  {location.pathname === link.path && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '20px',
                      height: '3px',
                      background: 'linear-gradient(90deg, #4FC3F7 0%, #29B6F6 100%)',
                      borderRadius: '2px',
                      animation: 'underlinePulse 2s infinite',
                    }} />
                  )}
                </Nav.Link>
              ))}
            </Nav>

            {/* Contact and Login Section */}
            <div className="d-flex align-items-center gap-3">
              {/* Phone Number with Dropdown */}
              <div 
                className="position-relative"
                onMouseEnter={() => setShowContactDropdown(true)}
                onMouseLeave={() => setShowContactDropdown(false)}
              >
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="phone-tooltip">
                      Click to call now! {contactInfo.timing}
                    </Tooltip>
                  }
                >
                  <Button
                    style={styles.phoneButton}
                    onClick={handlePhoneCall}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(76, 175, 80, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {pulsePhone && <div style={styles.phoneGlow} />}
                    <FaPhoneVolume size={16} />
                    <span>{contactInfo.phone}</span>
                    <FaChevronDown size={12} />
                  </Button>
                </OverlayTrigger>

                {/* Contact Information Dropdown */}
                {showContactDropdown && (
                  <div 
                    style={styles.contactDropdown}
                    className="position-absolute end-0 mt-2"
                  >
                    <h6 className="mb-3 text-primary fw-bold" style={{ fontSize: '16px' }}>
                      <FaPhone className="me-2" />
                      Contact Information
                    </h6>
                    
                    {/* Emergency Contact */}
                    <div 
                      style={{
                        ...styles.contactItem,
                        background: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
                        borderColor: '#F44336',
                      }}
                      onClick={() => window.location.href = `tel:${contactInfo.emergency.replace(/[\s\-]/g, '')}`}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                      <FaPhoneAlt style={{ color: '#F44336' }} />
                      <div>
                        <strong style={{ color: '#D32F2F' }}>Emergency</strong>
                        <div style={{ fontSize: '14px', color: '#666' }}>{contactInfo.emergency}</div>
                      </div>
                    </div>

                    {/* Primary Phone */}
                    <div 
                      style={styles.contactItem}
                      onClick={handlePhoneCall}
                      onMouseEnter={(e) => e.currentTarget.style = {...styles.contactItem, ...styles.contactItemHover}}
                      onMouseLeave={(e) => e.currentTarget.style = styles.contactItem}
                    >
                      <FaPhone style={{ color: '#4CAF50' }} />
                      <div>
                        <strong>Primary Phone</strong>
                        <div style={{ fontSize: '14px', color: '#666' }}>{contactInfo.phone}</div>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div 
                      style={styles.contactItem}
                      onClick={handleWhatsApp}
                      onMouseEnter={(e) => e.currentTarget.style = {...styles.contactItem, ...styles.contactItemHover}}
                      onMouseLeave={(e) => e.currentTarget.style = styles.contactItem}
                    >
                      <FaWhatsapp style={{ color: '#25D366' }} />
                      <div>
                        <strong>WhatsApp</strong>
                        <div style={{ fontSize: '14px', color: '#666' }}>{contactInfo.whatsapp}</div>
                      </div>
                    </div>

                    {/* Email */}
                    <div 
                      style={styles.contactItem}
                      onClick={() => window.location.href = `mailto:${contactInfo.email}`}
                      onMouseEnter={(e) => e.currentTarget.style = {...styles.contactItem, ...styles.contactItemHover}}
                      onMouseLeave={(e) => e.currentTarget.style = styles.contactItem}
                    >
                      <FaEnvelope style={{ color: '#2196F3' }} />
                      <div>
                        <strong>Email</strong>
                        <div style={{ fontSize: '14px', color: '#666' }}>{contactInfo.email}</div>
                      </div>
                    </div>

                    {/* Timing */}
                    <div style={{
                      ...styles.contactItem,
                      background: 'transparent',
                      cursor: 'default',
                    }}>
                      <FaClock style={{ color: '#FF9800' }} />
                      <div>
                        <strong>Office Hours</strong>
                        <div style={{ fontSize: '14px', color: '#666' }}>{contactInfo.timing}</div>
                      </div>
                    </div>

                    {/* Address */}
                    <div style={{
                      padding: '12px',
                      background: 'rgba(21, 101, 192, 0.05)',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#666',
                      border: '1px solid rgba(21, 101, 192, 0.1)',
                    }}>
                      📍 {contactInfo.address}
                    </div>
                  </div>
                )}
              </div>

              {/* User Authentication */}
              <div className="d-flex align-items-center gap-2">
                {user ? (
                  <Dropdown align="end">
                    <Dropdown.Toggle 
                      variant="light" 
                      className="d-flex align-items-center"
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '8px 16px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: user.role === 'admin' 
                          ? 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
                          : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '8px',
                        color: 'white',
                        fontSize: '14px',
                      }}>
                        {user.role === 'admin' ? <FaUserShield /> : <FaUser />}
                      </div>
                      <span className="d-none d-md-inline">
                        {user.role === 'admin' ? 'Admin' : user.username}
                      </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '15px',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                      animation: 'dropdownSlide 0.3s ease',
                    }}>
                      {user.role === 'student' && (
                        <>
                          <Dropdown.Item 
                            as={Link} 
                            to="/student"
                            style={{
                              padding: '12px 16px',
                              borderRadius: '10px',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(33, 150, 243, 0.1)';
                              e.currentTarget.style.transform = 'translateX(5px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.transform = 'translateX(0)';
                            }}
                          >
                            <FaUser className="me-2" />
                            Student Portal
                          </Dropdown.Item>
                          <Dropdown.Divider />
                        </>
                      )}
                      {user.role === 'admin' && (
                        <>
                          <Dropdown.Item 
                            as={Link} 
                            to="/admin"
                            style={{
                              padding: '12px 16px',
                              borderRadius: '10px',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 152, 0, 0.1)';
                              e.currentTarget.style.transform = 'translateX(5px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.transform = 'translateX(0)';
                            }}
                          >
                            <FaUserShield className="me-2" />
                            Admin Dashboard
                          </Dropdown.Item>
                          <Dropdown.Divider />
                        </>
                      )}
                      <Dropdown.Item 
                        onClick={handleLogout}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '10px',
                          color: '#F44336',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(244, 67, 54, 0.1)';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <FaSignOutAlt className="me-2" />
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <>
                    {showLoginButton && (
                      <Button 
                        as={Link} 
                        to="/login" 
                        variant="outline-light"
                        className="d-flex align-items-center"
                        style={{
                          borderRadius: '25px',
                          padding: '8px 20px',
                          fontWeight: '500',
                          borderWidth: '2px',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.color = '#1565C0';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <FaSignInAlt className="me-2" />
                        Student Login
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Menu Overlay */}
      <div style={styles.mobileMenu}>
        <div className="d-flex flex-column h-100">
          {/* User Profile in Mobile Menu */}
          {user && (
            <div style={styles.mobileUserProfile}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: user.role === 'admin' 
                  ? 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
                  : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
              }}>
                {user.role === 'admin' ? <FaUserShield /> : <FaUser />}
              </div>
              <div>
                <div className="text-white fw-bold">
                  {user.role === 'admin' ? 'Admin' : user.username}
                </div>
                <small className="text-light" style={{ opacity: 0.8 }}>
                  {user.role === 'admin' ? 'Administrator' : 'Student'}
                </small>
              </div>
            </div>
          )}

          {/* Mobile Nav Links */}
          <div className="flex-grow-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  ...styles.navLink,
                  ...(location.pathname === link.path ? styles.activeLink : {}),
                  margin: '8px 0',
                  fontSize: '15px',
                  padding: '12px 16px',
                }}
                onClick={() => setIsMobileMenuOpen(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateX(10px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = location.pathname === link.path 
                    ? styles.activeLink.background 
                    : 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '16px', width: '24px' }}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Login/Logout Button */}
          <div className="mt-3">
            {user ? (
              <>
                {user.role === 'student' && (
                  <Link
                    to="/student"
                    style={{
                      ...styles.mobileLoginButton,
                      background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaUser className="me-2" />
                    Student Portal
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    style={{
                      ...styles.mobileLoginButton,
                      background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaUserShield className="me-2" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    ...styles.mobileLoginButton,
                    background: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
                    marginTop: '10px',
                  }}
                >
                  <FaSignOutAlt className="me-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={styles.mobileLoginButton}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaSignInAlt className="me-2" />
                  Student Login
                </Link>
               {/*} <Link
                  to="/admin-login"
                  style={{
                    ...styles.mobileLoginButton,
                    background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                    marginTop: '10px',
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUserShield className="me-2" />
                  Admin Login
                </Link>*/}
              </>
            )}
          </div>

          {/* Mobile Contact Info */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '15px',
            borderRadius: '15px',
            marginTop: '15px',
            marginBottom: '10px',
          }}>
            <h6 className="text-white mb-2" style={{ fontSize: '14px' }}>Contact Us</h6>
            
            <div 
              style={{
                ...styles.contactItem,
                background: 'rgba(76, 175, 80, 0.2)',
                marginBottom: '8px',
                padding: '10px',
              }}
              onClick={() => {
                handlePhoneCall();
                setIsMobileMenuOpen(false);
              }}
            >
              <FaPhoneVolume style={{ color: '#4CAF50', fontSize: '14px' }} />
              <div className="text-white" style={{ fontSize: '12px' }}>
                <div>{contactInfo.phone}</div>
                <small>Tap to call</small>
              </div>
            </div>

            <div 
              style={{
                ...styles.contactItem,
                background: 'rgba(37, 211, 102, 0.2)',
                padding: '10px',
              }}
              onClick={() => {
                handleWhatsApp();
                setIsMobileMenuOpen(false);
              }}
            >
              <FaWhatsapp style={{ color: '#25D366', fontSize: '14px' }} />
              <div className="text-white" style={{ fontSize: '12px' }}>
                <div>WhatsApp</div>
                <small>Tap to chat</small>
              </div>
            </div>
          </div>

          {/* Current Time in Mobile */}
          <div className="text-center mt-2">
            <div style={styles.timeDisplay} className="d-inline-flex">
              <FaClock size={10} />
              <span>{formatTime(currentTime)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inline CSS Animations */}
      <style>
        {`
          @keyframes logoFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          
          @keyframes phonePulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes ripple {
            0% { 
              width: 0; 
              height: 0; 
              opacity: 0.5; 
            }
            100% { 
              width: 200px; 
              height: 200px; 
              opacity: 0; 
            }
          }
          
          @keyframes dropdownSlide {
            from {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes underlinePulse {
            0%, 100% { width: 20px; opacity: 1; }
            50% { width: 30px; opacity: 0.7; }
          }
          
          @keyframes badgePulse {
            0%, 100% { 
              transform: scale(1); 
              box-shadow: 0 0 0 0 rgba(255, 64, 129, 0.7);
            }
            50% { 
              transform: scale(1.1); 
              box-shadow: 0 0 0 5px rgba(255, 64, 129, 0);
            }
          }
          
          /* Mobile backdrop */
          .mobile-backdrop {
            position: fixed;
            top: 70px;
            left: 0;
            width: 100%;
            height: calc(100vh - 70px);
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            z-index: 998;
            transition: opacity 0.3s ease;
          }
          
          /* Responsive adjustments */
          @media (max-width: 991px) {
            .navbar-brand h5 {
              font-size: 16px;
            }
            
            .navbar-brand small {
              font-size: 10px;
            }
            
            .phone-button-mobile {
              font-size: 12px;
              padding: 6px 12px;
            }
          }
          
          @media (max-width: 576px) {
            .navbar-brand h5 {
              font-size: 14px;
            }
            
            .mobile-login-btn {
              font-size: 12px;
              padding: 5px 10px;
            }
          }
        `}
      </style>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-backdrop d-lg-none"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default PublicNavbar;