import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import MessageFeedback from './MessageFeedback';

function ChatHistory({ messages, onFeedbackSubmitted }) {
  const getMessageIcon = (role) => {
    switch (role) {
      case 'user':
        return 'fas fa-user';
      case 'assistant':
        return 'fas fa-robot';
      case 'expert':
        return 'fas fa-user-tie';
      default:
        return 'fas fa-comment';
    }
  };

  const getMessageBadge = (role, isManual) => {
    if (role === 'expert' || isManual) {
      return <Badge bg="info" className="ms-2">Expert Answer</Badge>;
    }
    if (role === 'assistant') {
      return <Badge bg="secondary" className="ms-2">AI Generated</Badge>;
    }
    return null;
  };

  return (
    <div className="chat-history">
      <div className="chat-messages" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {messages.length === 0 ? (
          <div className="empty-chat">
            <i className="fas fa-comments empty-icon"></i>
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message-item ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <Card className="message-card">
                <Card.Body className="message-body">
                  <div className="message-header">
                    <div className="message-sender">
                      <i className={`${getMessageIcon(message.role)} me-2`}></i>
                      <strong>
                        {message.role === 'user' ? 'You' :
                         message.role === 'expert' ? 'Expert' : 'AI Assistant'}
                      </strong>
                      {getMessageBadge(message.role, message.is_manual)}
                    </div>
                    <div className="message-time">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="message-content">
                    {message.content}
                  </div>

                  {message.role === 'assistant' && (
                    <div className="message-actions">
                      {message.rating ? (
                        <div className="rating-display">
                          <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <i
                                key={star}
                                className={`fas fa-star ${star <= message.rating ? 'active' : ''}`}
                              ></i>
                            ))}
                          </div>
                          <small className="text-muted">Rated {message.rating}/5</small>
                        </div>
                      ) : (
                        <MessageFeedback
                          messageId={message.id}
                          onFeedbackSubmitted={onFeedbackSubmitted}
                        />
                      )}
                    </div>
                  )}

                  {message.feedback && (
                    <div className="message-feedback">
                      <small className="text-muted">
                        <i className="fas fa-comment me-1"></i>
                        Feedback: {message.feedback}
                      </small>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChatHistory;