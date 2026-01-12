import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Tabs,
  Tab,
  Alert,
  Badge,
  InputGroup,
  ListGroup,
  Modal
} from 'react-bootstrap';
import {
  FaCog,
  FaPalette,
  FaBell,
  FaShieldAlt,
  FaDatabase,
  FaSave,
  FaUndo,
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaKey,
  FaUserCog,
  FaFileExport
} from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    instituteName: 'Nursing Institute of Excellence',
    instituteAddress: '123 Medical Street, Healthcare City',
    contactEmail: 'info@nursinginstitute.edu',
    contactPhone: '+91 98765 43210',
    websiteUrl: 'https://nursinginstitute.edu',
    timezone: 'Asia/Kolkata',
    language: 'English',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
    academicYear: new Date().getFullYear(),
    maxLoginAttempts: 5,
    sessionTimeout: 30
  });

  // Theme Settings
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#0d6efd',
    secondaryColor: '#6c757d',
    accentColor: '#198754',
    themeMode: 'light',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    headerColor: '#ffffff',
    sidebarColor: '#343a40'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    studentAlerts: true,
    facultyAlerts: true,
    adminAlerts: true,
    attendanceAlerts: true,
    marksAlerts: true,
    feeAlerts: true,
    newsAlerts: true
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    requireStrongPassword: true,
    passwordExpiryDays: 90,
    twoFactorAuth: false,
    ipWhitelist: '',
    allowedFileTypes: 'pdf,doc,docx,xls,xlsx,jpg,jpeg,png',
    maxFileSize: 10,
    sslEnforced: true,
    cookieSecure: true
  });

  // Backup Settings
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    keepBackups: 30,
    backupLocation: 'local',
    cloudStorage: false,
    lastBackup: null,
    nextBackup: null
  });

  // Load settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/settings');
      if (response.data?.success) {
        const data = response.data.data;
        setGeneralSettings(data.general || generalSettings);
        setThemeSettings(data.theme || themeSettings);
        setNotificationSettings(data.notification || notificationSettings);
        setSecuritySettings(data.security || securitySettings);
        setBackupSettings(data.backup || backupSettings);
      } else {
        console.error('Fetch settings failed:', response.data);
        toast.error(response.data?.message || 'Failed to load settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error('Unauthorized. Please login as an admin.');
      } else {
        toast.error('Failed to load settings');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const settingsData = {
        general: generalSettings,
        theme: themeSettings,
        notification: notificationSettings,
        security: securitySettings,
        backup: backupSettings
      };

      const response = await api.put('/admin/settings', settingsData);
      if (response.data.success) {
        toast.success('Settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setLoading(true);
      try {
        const response = await api.post('/admin/settings/reset');
        if (response.data?.success) {
          toast.success('Settings reset to default');
          // Apply returned defaults immediately
          const defaults = response.data.data || {};
          setGeneralSettings(defaults.general || generalSettings);
          setThemeSettings(defaults.theme || themeSettings);
          setNotificationSettings(defaults.notification || notificationSettings);
          setSecuritySettings(defaults.security || securitySettings);
          setBackupSettings(defaults.backup || backupSettings);
        } else {
          console.error('Reset settings failed:', response.data);
          toast.error(response.data?.message || 'Failed to reset settings');
        }
      } catch (error) {
        console.error('Error resetting settings:', error.response?.data || error.message);
        toast.error('Failed to reset settings');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExportSettings = () => {
    const settings = {
      general: generalSettings,
      theme: themeSettings,
      notification: notificationSettings,
      security: securitySettings,
      backup: backupSettings,
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `institute_settings_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Settings exported successfully');
  };

  const handleClearCache = async () => {
    try {
      const response = await api.post('/admin/clear-cache');
      if (response.data?.success) {
        toast.success(response.data.message || 'Cache cleared successfully');
        setShowClearModal(false);
      } else {
        console.error('Clear cache failed:', response.data);
        toast.error(response.data?.message || 'Failed to clear cache');
      }
    } catch (error) {
      console.error('Error clearing cache:', error.response?.data || error.message);
      toast.error('Failed to clear cache');
    }
  };

  const runSystemCheck = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/system-check');
      if (response.data?.success) {
        const issues = response.data.data?.issues || [];
        if (issues.length === 0) {
          toast.success('System check passed - All systems operational');
        } else {
          toast.warning(`System check found ${issues.length} issues`);
          // Show small summary of issues
          console.warn('System check issues:', issues);
          toast((t) => (
            <div>
              <strong>System check found issues:</strong>
              <ul>
                {issues.slice(0, 3).map((iss, i) => (
                  <li key={i}>{iss.message || iss.name || JSON.stringify(iss)}</li>
                ))}
              </ul>
            </div>
          ));
        }
      } else {
        console.error('System check failed:', response.data);
        toast.error(response.data?.message || 'System check failed');
      }
    } catch (error) {
      console.error('System check error:', error.response?.data || error.message);
      toast.error('System check failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading settings...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1">System Settings</h2>
          <p className="text-muted mb-0">Configure and manage all system preferences</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={handleExportSettings}>
            <FaFileExport className="me-2" /> Export
          </Button>
          <Button variant="outline-warning" onClick={handleResetSettings}>
            <FaUndo className="me-2" /> Reset Defaults
          </Button>
          <Button variant="primary" onClick={handleSaveSettings} disabled={saving}>
            <FaSave className="me-2" />
            {saving ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={setActiveTab}
        className="mb-4"
        fill
      >
        <Tab eventKey="general" title={
          <span><FaCog className="me-2" /> General</span>
        }>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">General Settings</h5>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Institute Name *</Form.Label>
                    <Form.Control
                      type="text"
                      value={generalSettings.instituteName}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        instituteName: e.target.value
                      })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Contact Email *</Form.Label>
                    <Form.Control
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        contactEmail: e.target.value
                      })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Contact Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={generalSettings.contactPhone}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        contactPhone: e.target.value
                      })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Website URL</Form.Label>
                    <Form.Control
                      type="url"
                      value={generalSettings.websiteUrl}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        websiteUrl: e.target.value
                      })}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Institute Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={generalSettings.instituteAddress}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        instituteAddress: e.target.value
                      })}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Timezone</Form.Label>
                    <Form.Select
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        timezone: e.target.value
                      })}
                    >
                      <option value="Asia/Kolkata">India (IST)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">EST</option>
                      <option value="Europe/London">GMT</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Language</Form.Label>
                    <Form.Select
                      value={generalSettings.language}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        language: e.target.value
                      })}
                    >
                      <option value="English">English</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Hindi">Hindi</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Academic Year</Form.Label>
                    <Form.Control
                      type="number"
                      value={generalSettings.academicYear}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        academicYear: e.target.value
                      })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Max Login Attempts</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="10"
                      value={generalSettings.maxLoginAttempts}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        maxLoginAttempts: e.target.value
                      })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Session Timeout (minutes)</Form.Label>
                    <Form.Control
                      type="number"
                      min="5"
                      max="240"
                      value={generalSettings.sessionTimeout}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        sessionTimeout: e.target.value
                      })}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="theme" title={
          <span><FaPalette className="me-2" /> Theme</span>
        }>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Theme & Appearance</h5>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Primary Color</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="color"
                        value={themeSettings.primaryColor}
                        onChange={(e) => setThemeSettings({
                          ...themeSettings,
                          primaryColor: e.target.value
                        })}
                      />
                      <Form.Control
                        type="text"
                        value={themeSettings.primaryColor}
                        onChange={(e) => setThemeSettings({
                          ...themeSettings,
                          primaryColor: e.target.value
                        })}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Secondary Color</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="color"
                        value={themeSettings.secondaryColor}
                        onChange={(e) => setThemeSettings({
                          ...themeSettings,
                          secondaryColor: e.target.value
                        })}
                      />
                      <Form.Control
                        type="text"
                        value={themeSettings.secondaryColor}
                        onChange={(e) => setThemeSettings({
                          ...themeSettings,
                          secondaryColor: e.target.value
                        })}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Accent Color</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="color"
                        value={themeSettings.accentColor}
                        onChange={(e) => setThemeSettings({
                          ...themeSettings,
                          accentColor: e.target.value
                        })}
                      />
                      <Form.Control
                        type="text"
                        value={themeSettings.accentColor}
                        onChange={(e) => setThemeSettings({
                          ...themeSettings,
                          accentColor: e.target.value
                        })}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Theme Mode</Form.Label>
                    <Form.Select
                      value={themeSettings.themeMode}
                      onChange={(e) => setThemeSettings({
                        ...themeSettings,
                        themeMode: e.target.value
                      })}
                    >
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                      <option value="auto">Auto (System Preference)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Sidebar Color</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="color"
                        value={themeSettings.sidebarColor}
                        onChange={(e) => setThemeSettings({
                          ...themeSettings,
                          sidebarColor: e.target.value
                        })}
                      />
                      <Form.Control
                        type="text"
                        value={themeSettings.sidebarColor}
                        onChange={(e) => setThemeSettings({
                          ...themeSettings,
                          sidebarColor: e.target.value
                        })}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Logo URL</Form.Label>
                    <Form.Control
                      type="text"
                      value={themeSettings.logoUrl}
                      onChange={(e) => setThemeSettings({
                        ...themeSettings,
                        logoUrl: e.target.value
                      })}
                      placeholder="/logo.png"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Favicon URL</Form.Label>
                    <Form.Control
                      type="text"
                      value={themeSettings.faviconUrl}
                      onChange={(e) => setThemeSettings({
                        ...themeSettings,
                        faviconUrl: e.target.value
                      })}
                      placeholder="/favicon.ico"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <div className="mt-3 p-3 border rounded">
                    <h6>Preview</h6>
                    <div className="d-flex align-items-center gap-3">
                      <div 
                        className="p-3 rounded"
                        style={{
                          backgroundColor: themeSettings.primaryColor,
                          color: '#fff',
                          width: '100px',
                          textAlign: 'center'
                        }}
                      >
                        Primary
                      </div>
                      <div 
                        className="p-3 rounded"
                        style={{
                          backgroundColor: themeSettings.secondaryColor,
                          color: '#fff',
                          width: '100px',
                          textAlign: 'center'
                        }}
                      >
                        Secondary
                      </div>
                      <div 
                        className="p-3 rounded"
                        style={{
                          backgroundColor: themeSettings.accentColor,
                          color: '#fff',
                          width: '100px',
                          textAlign: 'center'
                        }}
                      >
                        Accent
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="notifications" title={
          <span><FaBell className="me-2" /> Notifications</span>
        }>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Notification Settings</h5>
              <Row>
                <Col md={6}>
                  <h6>Notification Channels</h6>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Email Notifications</span>
                      <Form.Check
                        type="switch"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: e.target.checked
                        })}
                      />
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>SMS Notifications</span>
                      <Form.Check
                        type="switch"
                        checked={notificationSettings.smsNotifications}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          smsNotifications: e.target.checked
                        })}
                      />
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Push Notifications</span>
                      <Form.Check
                        type="switch"
                        checked={notificationSettings.pushNotifications}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          pushNotifications: e.target.checked
                        })}
                      />
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <h6>Alert Types</h6>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Student Alerts</span>
                      <Form.Check
                        type="switch"
                        checked={notificationSettings.studentAlerts}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          studentAlerts: e.target.checked
                        })}
                      />
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Faculty Alerts</span>
                      <Form.Check
                        type="switch"
                        checked={notificationSettings.facultyAlerts}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          facultyAlerts: e.target.checked
                        })}
                      />
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Attendance Alerts</span>
                      <Form.Check
                        type="switch"
                        checked={notificationSettings.attendanceAlerts}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          attendanceAlerts: e.target.checked
                        })}
                      />
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Marks Alerts</span>
                      <Form.Check
                        type="switch"
                        checked={notificationSettings.marksAlerts}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          marksAlerts: e.target.checked
                        })}
                      />
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="security" title={
          <span><FaShieldAlt className="me-2" /> Security</span>
        }>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Security Settings</h5>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Require Strong Password</Form.Label>
                    <Form.Check
                      type="switch"
                      checked={securitySettings.requireStrongPassword}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings,
                        requireStrongPassword: e.target.checked
                      })}
                      label="Minimum 8 characters with uppercase, lowercase, number, and special character"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Password Expiry (Days)</Form.Label>
                    <Form.Control
                      type="number"
                      min="30"
                      max="365"
                      value={securitySettings.passwordExpiryDays}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings,
                        passwordExpiryDays: e.target.value
                      })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Two-Factor Authentication</Form.Label>
                    <Form.Check
                      type="switch"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings,
                        twoFactorAuth: e.target.checked
                      })}
                      label="Require 2FA for admin login"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>IP Whitelist (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      value={securitySettings.ipWhitelist}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings,
                        ipWhitelist: e.target.value
                      })}
                      placeholder="192.168.1.1, 10.0.0.0/24"
                    />
                    <Form.Text className="text-muted">
                      Comma-separated IPs or CIDR ranges. Leave empty for all IPs.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Allowed File Types</Form.Label>
                    <Form.Control
                      type="text"
                      value={securitySettings.allowedFileTypes}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings,
                        allowedFileTypes: e.target.value
                      })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Max File Size (MB)</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="100"
                      value={securitySettings.maxFileSize}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings,
                        maxFileSize: e.target.value
                      })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>SSL Enforcement</Form.Label>
                    <Form.Check
                      type="switch"
                      checked={securitySettings.sslEnforced}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings,
                        sslEnforced: e.target.checked
                      })}
                      label="Force HTTPS connections"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Secure Cookies</Form.Label>
                    <Form.Check
                      type="switch"
                      checked={securitySettings.cookieSecure}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings,
                        cookieSecure: e.target.checked
                      })}
                      label="Set secure flag on cookies"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="backup" title={
          <span><FaDatabase className="me-2" /> Backup</span>
        }>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Backup & Maintenance</h5>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Auto Backup</Form.Label>
                    <Form.Check
                      type="switch"
                      checked={backupSettings.autoBackup}
                      onChange={(e) => setBackupSettings({
                        ...backupSettings,
                        autoBackup: e.target.checked
                      })}
                      label="Enable automatic backups"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Backup Frequency</Form.Label>
                    <Form.Select
                      value={backupSettings.backupFrequency}
                      onChange={(e) => setBackupSettings({
                        ...backupSettings,
                        backupFrequency: e.target.value
                      })}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Backup Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={backupSettings.backupTime}
                      onChange={(e) => setBackupSettings({
                        ...backupSettings,
                        backupTime: e.target.value
                      })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Keep Backups (Days)</Form.Label>
                    <Form.Control
                      type="number"
                      min="7"
                      max="365"
                      value={backupSettings.keepBackups}
                      onChange={(e) => setBackupSettings({
                        ...backupSettings,
                        keepBackups: e.target.value
                      })}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Backup Location</Form.Label>
                    <Form.Select
                      value={backupSettings.backupLocation}
                      onChange={(e) => setBackupSettings({
                        ...backupSettings,
                        backupLocation: e.target.value
                      })}
                    >
                      <option value="local">Local Server</option>
                      <option value="cloud">Cloud Storage</option>
                      <option value="both">Both Local & Cloud</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <div className="mt-4">
                    <h6>Backup Actions</h6>
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary">
                        <FaDatabase className="me-2" />
                        Backup Now
                      </Button>
                      <Button variant="outline-secondary" onClick={() => setShowClearModal(true)}>
                        <FaTrash className="me-2" />
                        Clear Cache
                      </Button>
                      <Button variant="outline-success" onClick={runSystemCheck}>
                        <FaCog className="me-2" />
                        System Check
                      </Button>
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <Alert variant="info" className="mt-3">
                    <strong>Last Backup:</strong> {backupSettings.lastBackup || 'Never'}
                    <br />
                    <strong>Next Backup:</strong> {backupSettings.nextBackup || 'Not scheduled'}
                  </Alert>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Clear Cache Modal */}
      <Modal show={showClearModal} onHide={() => setShowClearModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Clear System Cache</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <strong>Warning:</strong> This will clear all cached data including:
            <ul className="mt-2 mb-0">
              <li>Session cache</li>
              <li>Database query cache</li>
              <li>File cache</li>
              <li>Temporary uploads</li>
            </ul>
            <p className="mt-2 mb-0">The system might be slower for a few moments after clearing cache.</p>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClearModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleClearCache}>
            Clear Cache
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SettingsPage;