import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaGraduationCap, 
  FaImages, 
  FaNewspaper,
  FaCalendarAlt,
  FaCog,
  FaUserShield,
  FaFileAlt,
  FaHospital,
  FaDownload
} from 'react-icons/fa';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      path: '', // relative to /admin
      icon: <FaTachometerAlt />,
      exact: true
    },
    {
      title: 'Student Management',
      path: 'students',
      icon: <FaUsers />,
      submenu: [
        { title: 'All Students', path: '/admin/students' },
        { title: 'Add Student', path: '/admin/students/add' },
        { title: 'Bulk Upload', path: '/admin/students/bulk-upload' },
        { title: 'Attendance', path: '/admin/students/attendance' }
      ]
    },
    {
      title: 'Faculty Management',
      path: 'faculty',
      icon: <FaUserShield />,
      submenu: [
        { title: 'All Faculty', path: '/admin/faculty' },
        { title: 'Add Faculty', path: '/admin/faculty/add' }
      ]
    },
    {
      title: 'Course Management',
      path: 'courses',
      icon: <FaGraduationCap />,
      submenu: [
        { title: 'All Courses', path: '/admin/courses' },
        { title: 'Add Course', path: '/admin/courses/add' },
        { title: 'Syllabus', path: '/admin/courses/syllabus' }
      ]
    },
    {
      title: 'Content Management',
      icon: <FaFileAlt />,
      submenu: [
        { title: 'Gallery', path: 'gallery', icon: <FaImages /> },
        { title: 'News & Events', path: 'news', icon: <FaNewspaper /> },
        { title: 'Downloads', path: 'downloads', icon: <FaDownload /> }
      ]
    },
    {
      title: 'Academic Management',
      icon: <FaGraduationCap />,
      submenu: [
        { title: 'Attendance', path: '/admin/academics/attendance' },
        { title: 'Marks', path: '/admin/academics/marks' },
        { title: 'Timetable', path: '/admin/academics/timetable' }
      ]
    },
    {
      title: 'Placement & Internship',
      path: 'placement',
      icon: <FaHospital />,
      submenu: [
        { title: 'Placement Records', path: '/admin/placement/records' },
        { title: 'Companies', path: '/admin/placement/companies' },
        { title: 'Internship Schedule', path: '/admin/placement/internship' }
      ]
    },
    {
      title: 'Website CMS',
      path: 'website',
      icon: <FaCalendarAlt />,
      submenu: [
        { title: 'Homepage', path: '/admin/website/homepage' },
        { title: 'About Page', path: '/admin/website/about' },
        { title: 'Contact Page', path: '/admin/website/contact' }
      ]
    },
    {
      title: 'Settings',
      path: 'settings',
      icon: <FaCog />,
      submenu: [
        { title: 'User Management', path: '/admin/settings/users' },
        { title: 'System Settings', path: '/admin/settings/system' },
        { title: 'Backup', path: '/admin/settings/backup' }
      ]
    }
  ];

  const isActive = (path, exact = false) => {
    const adminPrefix = '/admin';
    const target = path === '' ? `${adminPrefix}` : `${adminPrefix}/${path}`;
    if (exact) {
      return location.pathname === target || location.pathname === `${target}/`;
    }
    return location.pathname.startsWith(target);
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header p-3 border-bottom">
        <h6 className="mb-0 text-primary fw-bold">Admin Panel</h6>
        <small className="text-muted">Complete Management System</small>
      </div>
      
      <Nav className="flex-column p-3" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        {menuItems.map((item, index) => (
          <div key={index} className="mb-2">
            {item.submenu ? (
              <>
                <div className="sidebar-section-header d-flex align-items-center text-muted mb-2 px-2 py-1">
                  <span className="me-2">{item.icon}</span>
                  <small className="fw-semibold">{item.title}</small>
                </div>
                {item.submenu.map((subItem, subIndex) => (
                  <Nav.Link
                    key={subIndex}
                    as={Link}
                    to={subItem.path}
                    className={`sidebar-link ps-4 ${isActive(subItem.path) ? 'active' : ''}`}
                  >
                    <span className="sidebar-icon">{subItem.icon || item.icon}</span>
                    <span className="sidebar-text">{subItem.title}</span>
                  </Nav.Link>
                ))}
              </>
            ) : (
              <Nav.Link
                as={Link}
                to={item.path}
                className={`sidebar-link mb-2 ${isActive(item.path, item.exact) ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.title}</span>
              </Nav.Link>
            )}
          </div>
        ))}
      </Nav>

      <div className="sidebar-footer p-3 border-top">
        <div className="text-center">
          <small className="text-muted d-block">Nursing Institute</small>
          <small className="text-muted">v1.0.0</small>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;