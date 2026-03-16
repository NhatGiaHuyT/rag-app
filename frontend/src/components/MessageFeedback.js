import React, { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { submitMessageFeedback } from '../services/apiCalls';

const MessageFeedback = ({ messageId, onFeedbackSubmitted }) => {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await submitMessageFeedback(messageId, rating, feedback.trim() || null);
      setShowModal(false);
      resetForm();
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (err) {
      setError('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setFeedback('');
    setError(null);
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <>
      <Button
        variant="outline-primary"
        size="sm"
        onClick={() => setShowModal(true)}
        className="feedback-btn"
      >
        <i className="fas fa-star me-1"></i>
        Rate Answer
      </Button>

      <Modal show={showModal} onHide={handleClose} centered className="feedback-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-star text-warning me-2"></i>
            Rate This Answer
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <div className="rating-section mb-4">
            <h6>How would you rate this answer?</h6>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <i className="fas fa-star"></i>
                </button>
              ))}
            </div>
            <div className="rating-labels">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Additional Feedback (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you think about this answer..."
                className="feedback-textarea"
              />
            </Form.Group>

            <div className="d-flex gap-2 mt-3">
              <Button
                type="submit"
                variant="primary"
                disabled={submitting || rating === 0}
                className="submit-feedback-btn"
              >
                {submitting ? (
                  <>
                    <div className="loading-spinner-sm me-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane me-2"></i>
                    Submit Feedback
                  </>
                )}
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MessageFeedback;