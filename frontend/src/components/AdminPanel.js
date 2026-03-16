import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Alert, Badge, Tab, Tabs } from 'react-bootstrap';
import { getAllUsers, createUserAdmin, updateUserAdmin, deleteUserAdmin, getAllDocumentsAdmin, createDocumentAdmin, deleteDocumentAdmin, grantDocumentPermission, getSystemStats, provideManualAnswer } from '../services/apiCalls';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // User management state
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  // Document management state
  const [showDocModal, setShowDocModal] = useState(false);
  const [docForm, setDocForm] = useState({
    filename: '',
    filePath: '',
    fileSize: 0
  });

  // Permission management state
  const [showPermModal, setShowPermModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [permForm, setPermForm] = useState({
    userId: '',
    canRead: true
  });

  // Manual answer state
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [answerContent, setAnswerContent] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, docsData, statsData] = await Promise.all([
        getAllUsers(),
        getAllDocumentsAdmin(),
        getSystemStats()
      ]);
      setUsers(usersData);
      setDocuments(docsData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Failed to load admin data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // User management functions
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUserAdmin(editingUser.id, userForm.username, userForm.email, userForm.password, userForm.role);
      } else {
        await createUserAdmin(userForm.username, userForm.email, userForm.password, userForm.role);
      }
      await loadData();
      setShowUserModal(false);
      resetUserForm();
    } catch (err) {
      setError('Failed to save user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserAdmin(userId);
        await loadData();
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const resetUserForm = () => {
    setUserForm({ username: '', email: '', password: '', role: 'user' });
    setEditingUser(null);
  };

  // Document management functions
  const handleDocSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDocumentAdmin(docForm.filename, docForm.filePath, docForm.fileSize);
      await loadData();
      setShowDocModal(false);
      setDocForm({ filename: '', filePath: '', fileSize: 0 });
    } catch (err) {
      setError('Failed to create document');
    }
  };

  const handleDeleteDoc = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocumentAdmin(docId);
        await loadData();
      } catch (err) {
        setError('Failed to delete document');
      }
    }
  };

  // Permission management functions
  const handleGrantPermission = async (e) => {
    e.preventDefault();
    try {
      await grantDocumentPermission(selectedDoc.id, parseInt(permForm.userId), permForm.canRead);
      await loadData();
      setShowPermModal(false);
      setPermForm({ userId: '', canRead: true });
      setSelectedDoc(null);
    } catch (err) {
      setError('Failed to grant permission');
    }
  };

  // Manual answer function
  const handleManualAnswer = async (e) => {
    e.preventDefault();
    try {
      await provideManualAnswer(selectedMessage.id, answerContent);
      await loadData();
      setShowAnswerModal(false);
      setAnswerContent('');
      setSelectedMessage(null);
    } catch (err) {
      setError('Failed to provide manual answer');
    }
  };

  return (
    <Container className="admin-panel">
      <div className="admin-header">
        <h2 className="admin-title">
          <i className="fas fa-cog me-2"></i>
          Admin Panel
        </h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {stats && (
        <Row className="stats-row mb-4">
          <Col md={2}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>{stats.total_users}</h3>
                <p>Total Users</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <h3>{stats.total_documents}</h3>
                <p>Documents</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">
                  <i className="fas fa-comments"></i>
                </div>
                <h3>{stats.total_conversations}</h3>
                <p>Conversations</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">
                  <i className="fas fa-question"></i>
                </div>
                <h3>{stats.total_questions}</h3>
                <p>Questions</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">
                  <i className="fas fa-star"></i>
                </div>
                <h3>{stats.average_rating.toFixed(1)}</h3>
                <p>Avg Rating</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">
                  <i className="fas fa-sync"></i>
                </div>
                <Button variant="primary" onClick={loadData} disabled={loading}>
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="admin-tabs">
        <Tab eventKey="users" title="User Management">
          <Card className="admin-card">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Users</h5>
                <Button
                  variant="primary"
                  onClick={() => {
                    resetUserForm();
                    setShowUserModal(true);
                  }}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add User
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={user.role === 'admin' ? 'danger' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={user.is_active ? 'success' : 'warning'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setEditingUser(user);
                            setUserForm({
                              username: user.username,
                              email: user.email,
                              password: '',
                              role: user.role
                            });
                            setShowUserModal(true);
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="documents" title="Document Management">
          <Card className="admin-card">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Documents</h5>
                <Button
                  variant="primary"
                  onClick={() => setShowDocModal(true)}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add Document
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Filename</th>
                    <th>Size</th>
                    <th>Uploaded By</th>
                    <th>Uploaded</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(doc => (
                    <tr key={doc.id}>
                      <td>{doc.filename}</td>
                      <td>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</td>
                      <td>User {doc.uploaded_by}</td>
                      <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                      <td>
                        <Badge bg={doc.is_active ? 'success' : 'secondary'}>
                          {doc.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setSelectedDoc(doc);
                            setShowPermModal(true);
                          }}
                        >
                          <i className="fas fa-user-plus"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteDoc(doc.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* User Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? 'Edit User' : 'Add New User'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUserSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={userForm.username}
                onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                required={!editingUser}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={userForm.role}
                onChange={(e) => setUserForm({...userForm, role: e.target.value})}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">
                {editingUser ? 'Update' : 'Create'}
              </Button>
              <Button variant="secondary" onClick={() => setShowUserModal(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Document Modal */}
      <Modal show={showDocModal} onHide={() => setShowDocModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleDocSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Filename</Form.Label>
              <Form.Control
                type="text"
                value={docForm.filename}
                onChange={(e) => setDocForm({...docForm, filename: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>File Path</Form.Label>
              <Form.Control
                type="text"
                value={docForm.filePath}
                onChange={(e) => setDocForm({...docForm, filePath: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>File Size (bytes)</Form.Label>
              <Form.Control
                type="number"
                value={docForm.fileSize}
                onChange={(e) => setDocForm({...docForm, fileSize: parseInt(e.target.value) || 0})}
                required
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">Create</Button>
              <Button variant="secondary" onClick={() => setShowDocModal(false)}>Cancel</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Permission Modal */}
      <Modal show={showPermModal} onHide={() => setShowPermModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Grant Permission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Grant access to: <strong>{selectedDoc?.filename}</strong></p>
          <Form onSubmit={handleGrantPermission}>
            <Form.Group className="mb-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="number"
                value={permForm.userId}
                onChange={(e) => setPermForm({...permForm, userId: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Can Read"
                checked={permForm.canRead}
                onChange={(e) => setPermForm({...permForm, canRead: e.target.checked})}
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">Grant</Button>
              <Button variant="secondary" onClick={() => setShowPermModal(false)}>Cancel</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminPanel;