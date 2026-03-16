import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';

function ConversationList({ conversations, selectedConversation, onSelectConversation, onNewConversation }) {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Conversations</h5>
        <Button variant="outline-primary" size="sm" onClick={onNewConversation}>
          New
        </Button>
      </div>
      <ListGroup>
        {conversations.map((conv) => (
          <ListGroup.Item
            key={conv.id}
            active={selectedConversation && selectedConversation.id === conv.id}
            onClick={() => onSelectConversation(conv)}
            style={{ cursor: 'pointer' }}
          >
            <div className="text-truncate">
              {conv.title}
            </div>
            <small className="text-muted">
              {new Date(conv.created_at).toLocaleDateString()}
            </small>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default ConversationList;