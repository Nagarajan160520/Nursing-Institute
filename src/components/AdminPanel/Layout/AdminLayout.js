// src/components/AdminPanel/Layout/AdminLayout.js - CORRECTED
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Container, Nav, Button } from 'react-bootstrap';
import {
  FaTachometerAlt,
  FaUsers,
  FaGraduationCap,
  FaImages,
  FaNewspaper,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserShield,
  FaUserGraduate,
  FaChartBar,
  FaUser,
  FaFileAlt,
  FaBell,
  FaAward,
  FaDownload,
  FaEnvelope
} from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import './AdminLayout.css';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Redirect non-admins or unauthenticated users away from admin area
  useEffect(() => {
    // Wait until auth loading finishes
    if (loading) return;

    if (!user) {
      // Not logged in - send to admin login
      navigate('/admin-login', { replace: true });
      return;
    }

    if (user.role !== 'admin') {
      // Logged in but not admin - send to home
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  // Socket.IO connection for real-time updates
  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const apiBase = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
    const token = localStorage.getItem('token');
    const socket = io(apiBase, { auth: { token }, transports: ['websocket'] });

    socket.on('connect', () => {
      console.log('Admin socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Admin socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // IMPORTANT: Use relative paths (without /admin prefix)
  // Because we're already inside /admin/* route
  const menuItems = [
    {
      title: 'Dashboard',
      path: 'dashboard', // NOT /admin/dashboard
      icon: <FaTachometerAlt />,
      exact: true
    },
    {
      title: 'Student Management',
      path: 'students', // NOT /admin/students
      icon: <FaUsers />
    },
   // {
    //  title: 'Faculty Management',
     // path: 'faculty',
      //icon: <FaUserGraduate />
    //},
    {
      title: 'Course Management',
      path: 'courses',
      icon: <FaGraduationCap />
    },
    {
      title: 'Marks Management',
      path: 'marks',
      icon: <FaAward />
    },
    {
      title: 'Timetable Management',
      path: 'timetable',
      icon: <FaCalendarAlt />
    },
    {
     title: 'Attendance',
    path: 'attendance',
      icon: <FaChartBar />
   },
    {
      title: 'User Management',
      path: 'users',
      icon: <FaUser />
    },
    {
      title: 'Content Management',
      icon: <FaFileAlt />,
      children: [
       // {
         // title: 'Content',
         // path: 'content',
         // icon: <FaNewspaper />
       // },
        {
          title: 'Gallery',
          path: 'gallery',
          icon: <FaImages />
        },
        {
          title: 'News',
          path: 'news',
          icon: <FaNewspaper />
        },
        {
          title: 'Events',
          path: 'events',
          icon: <FaCalendarAlt />
        },
        {
          title: 'Downloads',
          path: 'downloads',
          icon: <FaDownload />
        },
        {
          title: 'Notifications',
          path: 'notifications',
          icon: <FaBell />
        },
        {
          title: 'Contact',
          path: 'contact',
          icon: <FaEnvelope />
        }
      ]
    },
    {
      title: 'Settings',
      path: 'settings',
      icon: <FaCog />
    }
  ];

  return (
    <div className="admin-layout">
      {/* Top Header */}
      <header className="admin-header bg-white shadow-sm">
        <div className="d-flex align-items-center justify-content-between px-3 py-2">
          <div className="d-flex align-items-center">
            <Button
              variant="light"
              className="me-3 border-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </Button>
            <h5 className="mb-0 text-primary">Nursing Institute Admin</h5>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                   style={{ width: '40px', height: '40px' }}>
                <FaUserShield />
              </div>
              <div>
                <small className="d-block fw-semibold">{user?.username || 'Admin'}</small>
                <small className="text-muted">Administrator</small>
              </div>
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleLogout}
              className="d-flex align-items-center"
            >
              <FaSignOutAlt className="me-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="d-flex">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header p-3 border-bottom">
            <h6 className="mb-0 text-primary">Admin Navigation</h6>
          </div>
          
          <Nav className="flex-column p-3">
            {menuItems.map((item, index) => (
              item.children ? (
                <div key={index} className="mb-2">
                  <div className="sidebar-section-header text-muted mb-2">
                    <small>{item.title}</small>
                  </div>
                  {item.children.map((child, childIndex) => (
                    <Nav.Link
                      key={childIndex}
                      as={Link}
                      to={`/admin/${child.path}`} // Use absolute path to avoid relative routing issues
                      className="sidebar-link"
                    >
                      <span className="sidebar-icon">{child.icon}</span>
                      <span className="sidebar-text">{child.title}</span>
                    </Nav.Link>
                  ))}
                </div>
              ) : (
                <Nav.Link
                  key={index}
                  as={Link}
                  to={`/admin/${item.path}`} // Use absolute path to avoid relative routing issues
                  className="sidebar-link mb-2"
                  end={item.exact}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-text">{item.title}</span>
                </Nav.Link>
              )
            ))}
          </Nav>
        </aside>

        {/* Main Content */}
        <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Container fluid className="py-4">
            {/* Render children passed by parent routes (AdminPortalPage) or fallback to Outlet for nested routes */}
            {children || <Outlet />}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;