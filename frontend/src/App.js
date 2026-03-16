import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Button, Spinner, Form, Alert, InputGroup, Nav, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import FileList from './components/FileList';
import SearchForm from './components/SearchForm';
import ResponseTextBox from './components/ResponseTextBox';
import ConversationList from './components/ConversationList';
import ChatHistory from './components/ChatHistory';
import AdminPanel from './components/AdminPanel';
import { fetchFileList, searchQuery, uploadFiles, login, register, logout, createConversation, getConversations, getConversationMessages, addMessageToConversation, getUserDocuments } from './services/apiCalls';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [files, setFiles] = useState([]);
  const [fileListError, setFileListError] = useState(null);
  const [oversizedUpload, setOversizedUpload] = useState([]);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [authError, setAuthError] = useState('');
  const [userRole, setUserRole] = useState('user');
  const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'admin'

  // Conversation states
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState('');

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      getUserDocuments()
        .then(documents => setFiles(documents.map(doc => doc.filename)))
        .catch(error => {
          console.error('Error fetching user documents:', error);
          setFileListError('Failed to connect to the API.');
        });
      loadConversations();
    } else {
      setShowLogin(true);
    }
  }, []);

  const ALLOWED_FILE_TYPES = ['.pdf', '.txt'];
  const MAX_TOTAL_SIZE = 110 * 1024 * 1024; // Limit total upload size to 110MB (can be several files)

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isRegister) {
        await register(username, email, password);
        setAuthError('Registration successful! Please login.');
        setIsRegister(false);
      } else {
        const loginData = await login(username, password);
        setIsLoggedIn(true);
        setShowLogin(false);
        // Fetch user info and files after login
        await loadUserData();
      }
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const loadUserData = async () => {
    try {
      // For now, we'll assume we can get user role from a future endpoint
      // For demo purposes, we'll check if username contains 'admin'
      const currentUsername = username; // This should come from token decoding
      setUserRole(currentUsername.toLowerCase().includes('admin') ? 'admin' : 'user');

      const documents = await getUserDocuments();
      setFiles(documents.map(doc => doc.filename));
      await loadConversations();
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setShowLogin(true);
    setFiles([]);
    setResponse('');
    setQuery('');
    setConversations([]);
    setSelectedConversation(null);
    setChatMessages([]);
    setUserRole('user');
    setCurrentView('chat');
  };

  // Conversation functions
  const loadConversations = async () => {
    try {
      const convs = await getConversations();
      setConversations(convs);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadConversationMessages = async (conversationId) => {
    try {
      const messages = await getConversationMessages(conversationId);
      setChatMessages(messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    await loadConversationMessages(conversation.id);
  };

  const handleNewConversation = () => {
    setShowNewConversationModal(true);
  };

  const handleCreateConversation = async () => {
    if (!newConversationTitle.trim()) return;
    try {
      const newConv = await createConversation(newConversationTitle);
      setConversations([newConv, ...conversations]);
      setSelectedConversation(newConv);
      setChatMessages([]);
      setShowNewConversationModal(false);
      setNewConversationTitle('');
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleFileInputChange = async (e) => {
    setFileListError(null); // Clear any previous errors
    const files = Array.from(e.target.files);    
    // Filter out files that are not .pdf or .txt
    const validFiles = files.filter(file => 
      ALLOWED_FILE_TYPES.some(type => file.name.toLowerCase().endsWith(type))
    );
    // Check if any files were filtered out
    if (validFiles.length < files.length) {
      console.warn('Some files were skipped because they are not .pdf or .txt');
    }
    const totalSize = validFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      setOversizedUpload(validFiles);
      setShowSizeModal(true);
      return false;
    }
    if (validFiles.length > 0) {
      try {
        await uploadFiles(validFiles);
        const documents = await getUserDocuments(); // Retrieve the list of user documents
        setFiles(documents.map(doc => doc.filename));
        return true;
      } catch (error) {
        console.error('Error uploading files:', error);
        setFileListError('Error uploading files. Please try again.');
        return false;
      }
    } else {
      console.error('No valid files selected for upload');
      setFileListError('Please choose .pdf or .txt files.');
      return false;
    }
  };

  const handleCloseSizeModal = () => {
    setShowSizeModal(false);
    setOversizedUpload([]);
  };

  // Function to handle search form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Add user message to conversation if one is selected
      if (selectedConversation) {
        await addMessageToConversation(selectedConversation.id, query);
        const userMessage = {
          id: Date.now(),
          role: 'user',
          content: query,
          created_at: new Date().toISOString()
        };
        setChatMessages([...chatMessages, userMessage]);
      }

      // Prepare conversation history for the query
      const conversationHistory = selectedConversation ? 
        chatMessages.map(msg => ({ role: msg.role, content: msg.content })) : [];

      const result = await searchQuery(query, selectedConversation?.id, conversationHistory);
      setResponse(result);

      // Add assistant response to conversation
      if (selectedConversation) {
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: result,
          created_at: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while fetching the response.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <Container>
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-container">
                <img
                  src="/haystack-signet-colored-on-dark.png"
                  alt="Haystack Logo"
                />
              </div>
              <h1 className="app-title">RAG Assistant</h1>
            </div>
            {isLoggedIn && (
              <div className="header-actions">
                {isLoggedIn && (
                  <div className="nav-tabs">
                    <button
                      className={`nav-tab ${currentView === 'chat' ? 'active' : ''}`}
                      onClick={() => setCurrentView('chat')}
                    >
                      <i className="fas fa-comments me-2"></i>
                      Chat
                    </button>
                    <button
                      className={`nav-tab ${currentView === 'admin' ? 'active' : ''}`}
                      onClick={() => setCurrentView('admin')}
                    >
                      <i className="fas fa-cog me-2"></i>
                      Admin
                    </button>
                  </div>
                )}
                <Button className="logout-btn" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </Container>
      </header>

      {/* Auth Screen */}
      {showLogin && (
        <div className="auth-container">
          <div className="auth-card animate-fade-in">
            <h2 className="auth-title">Welcome Back</h2>
            {authError && <Alert variant="danger" className="animate-slide-up">{authError}</Alert>}
            <Form onSubmit={handleAuthSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                />
              </div>
              {isRegister && (
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
              <button type="submit" className="auth-btn">
                {isRegister ? 'Create Account' : 'Sign In'}
              </button>
              <div className="auth-toggle">
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => setIsRegister(!isRegister)}
                >
                  {isRegister ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}

      {/* Main App */}
      {isLoggedIn && (
        <div className="main-app">
          {currentView === 'admin' && userRole === 'admin' ? (
            <AdminPanel />
          ) : (
            <Container className="app-content">
              <div className="content-grid">
                {/* Left Sidebar - Conversations */}
                <div className="sidebar animate-fade-in">
                  <ConversationList
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    onSelectConversation={handleSelectConversation}
                    onNewConversation={handleNewConversation}
                  />
                </div>

                {/* Main Content */}
                <div className="main-content">
                  {/* Chat History */}
                  {selectedConversation && (
                    <div className="chat-container animate-slide-up">
                      <ChatHistory
                        messages={chatMessages}
                        onFeedbackSubmitted={() => loadConversationMessages(selectedConversation.id)}
                      />
                    </div>
                  )}

                  {/* Response Section */}
                  <div className="response-section animate-fade-in">
                    <div className="response-header">
                      <h3 className="response-title">
                        <i className="fas fa-robot me-2"></i>
                        AI Response
                      </h3>
                    </div>
                    <div className="response-content">
                      {response ? (
                        <p className="response-text">{response}</p>
                      ) : (
                        <p className="text-muted mb-0">
                          {selectedConversation
                            ? "Ask a question to start the conversation..."
                            : "Select or create a conversation to begin..."
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Search Section */}
                  <div className="search-section animate-fade-in">
                    <Form onSubmit={handleSubmit} className="search-form">
                      <div className="search-input-group">
                        <input
                          type="text"
                          className="search-input"
                          placeholder="Ask me anything about your documents..."
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <button
                        type="submit"
                        className="search-btn"
                        disabled={isLoading || !query.trim() || !selectedConversation}
                      >
                        {isLoading ? (
                          <>
                            <div className="loading-spinner"></div>
                            Thinking...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-search me-2"></i>
                            Ask AI
                          </>
                        )}
                      </button>
                    </Form>
                  </div>
                </div>

                {/* Right Sidebar - Files */}
                <div className="file-section animate-fade-in">
                  <FileList files={files} onFileInputChange={handleFileInputChange} error={fileListError} />
                </div>
              </div>
            </Container>
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-card">
            <div className="loading-spinner" style={{width: '40px', height: '40px'}}></div>
            <p className="loading-text">Processing your request...</p>
          </div>
        </div>
      )}

      {/* New Conversation Modal */}
      <Modal
        show={showNewConversationModal}
        onHide={() => setShowNewConversationModal(false)}
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-plus-circle me-2"></i>
            New Conversation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Conversation Title</Form.Label>
            <Form.Control
              type="text"
              value={newConversationTitle}
              onChange={(e) => setNewConversationTitle(e.target.value)}
              placeholder="Enter a title for your conversation"
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowNewConversationModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateConversation}
            disabled={!newConversationTitle.trim()}
          >
            <i className="fas fa-plus me-2"></i>
            Create Conversation
          </Button>
        </Modal.Footer>
      </Modal>

      {/* File Size Modal */}
      <Modal
        show={showSizeModal}
        onHide={handleCloseSizeModal}
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
            Upload Size Limit Exceeded
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The following files exceed the maximum upload size of 110MB:</p>
          <ul className="list-group">
            {oversizedUpload.map((file, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {file.name}
                <span className="badge bg-warning rounded-pill">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </li>
            ))}
          </ul>
          <p className="text-muted mt-3">
            Please reduce the file sizes or upload them separately.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSizeModal}>
            <i className="fas fa-check me-2"></i>
            Understood
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
