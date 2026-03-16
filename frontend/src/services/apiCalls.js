const API_URL = process.env.REACT_APP_HAYSTACK_API_URL || 'http://localhost:8000'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export async function fetchFileList() {
  const response = await fetch(`${API_URL}/files`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  const data = await response.json();
  return data.files;
}

export async function searchQuery(query, conversationId = null, conversationHistory = []) {
  const response = await fetch(`${API_URL}/search`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ 
      query,
      conversation_id: conversationId,
      conversation_history: conversationHistory
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  const data = await response.json();
  return data.results[0].answers[0].answer;
}

export async function uploadFiles(files) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  const response = await fetch(`${API_URL}/files`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  return await response.json();
}

export async function login(username, password) {
  const response = await fetch(`${API_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      username,
      password,
    }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
}

export async function register(username, email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return await response.json();
}

export function logout() {
  localStorage.removeItem('token');
}

// Conversation functions
export async function createConversation(title) {
  const response = await fetch(`${API_URL}/auth/conversations`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error('Failed to create conversation');
  }
  return await response.json();
}

export async function getConversations() {
  const response = await fetch(`${API_URL}/auth/conversations`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }
  const data = await response.json();
  return data;
}

export async function getConversationMessages(conversationId) {
  const response = await fetch(`${API_URL}/auth/conversations/${conversationId}/messages`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  const data = await response.json();
  return data;
}

export async function addMessageToConversation(conversationId, content) {
  const response = await fetch(`${API_URL}/auth/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error('Failed to add message');
  }
  return await response.json();
}

// Feedback functions
export async function submitMessageFeedback(messageId, rating, feedback = null) {
  const response = await fetch(`${API_URL}/auth/messages/${messageId}/feedback`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ rating, feedback }),
  });
  if (!response.ok) {
    throw new Error('Failed to submit feedback');
  }
  return await response.json();
}

// Admin functions
export async function getAllUsers() {
  const response = await fetch(`${API_URL}/auth/admin/users`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return await response.json();
}

export async function createUserAdmin(username, email, password, role = 'user') {
  const response = await fetch(`${API_URL}/auth/admin/users`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ username, email, password, role }),
  });
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  return await response.json();
}

export async function updateUserAdmin(userId, username, email, password, role) {
  const response = await fetch(`${API_URL}/auth/admin/users/${userId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ username, email, password, role }),
  });
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  return await response.json();
}

export async function deleteUserAdmin(userId) {
  const response = await fetch(`${API_URL}/auth/admin/users/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  return await response.json();
}

// Document management functions
export async function getAllDocumentsAdmin() {
  const response = await fetch(`${API_URL}/auth/admin/documents`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }
  return await response.json();
}

export async function createDocumentAdmin(filename, filePath, fileSize) {
  const response = await fetch(`${API_URL}/auth/admin/documents`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ filename, file_path: filePath, file_size: fileSize }),
  });
  if (!response.ok) {
    throw new Error('Failed to create document');
  }
  return await response.json();
}

export async function deleteDocumentAdmin(documentId) {
  const response = await fetch(`${API_URL}/auth/admin/documents/${documentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to delete document');
  }
  return await response.json();
}

// Document permissions
export async function grantDocumentPermission(documentId, userId, canRead = true) {
  const response = await fetch(`${API_URL}/auth/admin/documents/${documentId}/permissions`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ user_id: userId, can_read: canRead }),
  });
  if (!response.ok) {
    throw new Error('Failed to grant permission');
  }
  return await response.json();
}

export async function getUserDocuments() {
  const response = await fetch(`${API_URL}/auth/documents`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user documents');
  }
  return await response.json();
}

// Manual answer function
export async function provideManualAnswer(messageId, content) {
  const response = await fetch(`${API_URL}/auth/admin/messages/${messageId}/manual-answer`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error('Failed to provide manual answer');
  }
  return await response.json();
}

// Statistics function
export async function getSystemStats() {
  const response = await fetch(`${API_URL}/auth/admin/stats`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch statistics');
  }
  return await response.json();
}
