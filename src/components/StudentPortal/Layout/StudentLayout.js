import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Nav, Button, Badge } from 'react-bootstrap';
import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaChartLine,
  FaCalendarWeek,
  FaDownload,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
  FaHome
} from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import './StudentLayout.css';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';


const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch unread notifications count
  const fetchUnreadNotifications = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/student/notifications?unread=true`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUnreadNotifications(data.data.length);
      }
    } catch (error) {
      console.error('Failed to fetch unread notifications:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Initial fetch of unread notifications
    fetchUnreadNotifications();

    const apiBase = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
    const token = localStorage.getItem('token');
    const socket = io(apiBase, { auth: { token }, transports: ['websocket'] });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('downloads:created', (download) => {
      toast.success('New study material available');
      window.dispatchEvent(new CustomEvent('realtime:downloads', { detail: download }));
    });

    socket.on('attendance:changed', (payload) => {
      toast.success('Attendance updated');
      window.dispatchEvent(new CustomEvent('realtime:attendance', { detail: payload }));
    });

    socket.on('marks:added', (payload) => {
      toast.success('New marks recorded');
      window.dispatchEvent(new CustomEvent('realtime:marks', { detail: payload }));
    });

    socket.on('marks:published', (payload) => {
      toast.success('Marks published');
      window.dispatchEvent(new CustomEvent('realtime:marks', { detail: payload }));
    });

    socket.on('marks:updated', (payload) => {
      toast.success('Marks updated');
      window.dispatchEvent(new CustomEvent('realtime:marks', { detail: payload }));
    });

    // Real-time notification events
    socket.on('notification:created', (notification) => {
      toast.success('New notification received');
      setUnreadNotifications(prev => prev + 1);
      window.dispatchEvent(new CustomEvent('realtime:notifications', { detail: notification }));
    });

    socket.on('notification:read', () => {
      fetchUnreadNotifications(); // Refresh count
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '',
      icon: <FaTachometerAlt />,
      exact: true
    },
    {
      title: 'Attendance',
      path: 'attendance',
      icon: <FaCalendarCheck />
    },
    {
      title: 'Internal Marks',
      path: 'marks',
      icon: <FaChartLine />
    },
    {
      title: 'Timetable',
      path: 'timetable',
      icon: <FaCalendarWeek />
    },
    {
      title: 'Downloads',
      path: 'downloads',
      icon: <FaDownload />
    },
   // {
     // title: 'Notifications',
     // path: 'notifications',
     // icon: <FaBell />
    //},
    {
      title: 'Profile',
      path: 'profile',
      icon: <FaUserCircle />
    }
  ];

  return (
    <div className="student-layout">
      {/* Mobile Header */}
      <header className="student-header bg-white shadow-sm d-lg-none">
        <div className="d-flex align-items-center justify-content-between px-3 py-2">
          <div className="d-flex align-items-center">
            <Button
              variant="light"
              className="me-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </Button>
            <h6 className="mb-0 text-primary">Student Portal</h6>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              as={Link}
              to="/"
              className="d-flex align-items-center"
            >
              <FaHome className="me-1" />
              Home
            </Button>
          </div>
        </div>
      </header>

      <div className="d-flex">
        {/* Sidebar */}
        <aside className={`student-sidebar ${sidebarOpen ? 'open' : ''}`}>
          {/* Sidebar Header */}
          <div className="sidebar-header p-4 bg-primary text-white">
            <div className="text-center mb-3">
              <div className="bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <FaUserCircle size={40} />
              </div>
              <h6 className="mb-1">{user?.username || 'Student'}</h6>
              <small className="opacity-75">Student Portal</small>
            </div>
          </div>

          {/* Navigation */}
          <Nav className="flex-column p-3">
            {menuItems.map((item, index) => (
              <Nav.Link
                key={index}
                as={Link}
                to={item.path}
                className={`sidebar-link mb-2 ${location.pathname === item.path ? 'active' : ''}`}
                end={item.exact}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.title}</span>
              </Nav.Link>
            ))}
            
            <hr className="my-3" />
            
            <Nav.Link
              as={Link}
              to="/"
              className="sidebar-link mb-2"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-icon"><FaHome /></span>
              <span className="sidebar-text">Back to Website</span>
            </Nav.Link>
            
            <Nav.Link
              onClick={handleLogout}
              className="sidebar-link text-danger"
            >
              <span className="sidebar-icon"><FaSignOutAlt /></span>
              <span className="sidebar-text">Logout</span>
            </Nav.Link>
          </Nav>

          {/* Sidebar Footer */}
          <div className="sidebar-footer p-3 border-top">
            <small className="text-muted">
              © {new Date().getFullYear()} Nursing Institute
            </small>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`student-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
          {/* Desktop Header */}
          <header className="student-desktop-header bg-white shadow-sm d-none d-lg-block">
            <Container fluid>
              <div className="d-flex align-items-center justify-content-between py-3">
                <div>
                  <h5 className="mb-0 text-primary">Student Portal</h5>
                  <small className="text-muted">
                    Welcome to your academic dashboard
                  </small>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    as={Link}
                    to="/"
                    className="d-flex align-items-center"
                  >
                    <FaHome className="me-2" />
                    Visit Website
                  </Button>
                  <div className="position-relative">
                    <Button variant="light" size="sm">
                      <FaBell />
                      {unreadNotifications > 0 && (
                        <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle" pill>
                          {unreadNotifications > 99 ? '99+' : unreadNotifications}
                        </Badge>
                      )}
                    </Button>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleLogout}
                    className="d-flex align-items-center"
                  >
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </Container>
          </header>

          {/* Content Area */}
          <Container fluid className="py-4">
            <Outlet />
          </Container>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentLayout;