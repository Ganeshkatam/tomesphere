'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquarePlus, X, Star, Check, Send, AlertCircle, Lightbulb, Bug, Heart, MessageCircle } from 'lucide-react';
import { apiClient } from '../lib/api-client';

const FEEDBACK_CATEGORIES = [
  { id: 'SUGGESTION', label: 'Idea / Suggestion', icon: Lightbulb, color: 'var(--accent-amber)' },
  { id: 'BUG', label: 'Bug Report', icon: Bug, color: 'var(--accent-rose)' },
  { id: 'PRAISE', label: 'Appreciation', icon: Heart, color: 'var(--accent-cyan)' },
  { id: 'GENERAL', label: 'General Feedback', icon: MessageCircle, color: 'var(--accent-primary)' }
];

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('SUGGESTION');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [isPending, setIsPending] = useState(false);

  const modalRef = useRef(null);
  const textareaRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus textarea when modal opens
      setTimeout(() => textareaRef.current?.focus(), 80);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setStatus(null);

    const fd = new FormData(e.currentTarget);
    const honeypot = fd.get('website');

    try {
      const res = await apiClient.feedback.submit({
        category,
        rating,
        message,
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        website: honeypot
      });

      setStatus({
        type: 'success',
        message: res.confirmation || 'Thank you! Your feedback has been received.'
      });

      // Reset form fields
      setMessage('');
      setName('');
      setEmail('');
      setRating(5);

      // Auto close after 2.5s on success
      setTimeout(() => {
        setIsOpen(false);
        setStatus(null);
      }, 2500);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Unable to submit feedback. Please try again.'
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <aside aria-label="Quick platform feedback">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="feedback-floating-btn"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label="Open platform feedback form"
        >
          <span className="feedback-btn-pulse" aria-hidden="true" />
          <MessageSquarePlus size={18} className="feedback-btn-icon" />
          <span className="feedback-btn-label">Feedback</span>
        </button>
      </aside>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          className="feedback-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          role="presentation"
        >
          <div
            className="feedback-modal-card"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-dialog-title"
          >
            {/* Modal Header */}
            <div className="feedback-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="feedback-modal-icon-badge">
                  <MessageSquarePlus size={18} />
                </div>
                <div>
                  <h2 id="feedback-dialog-title" className="feedback-modal-title">
                    Share Your Feedback
                  </h2>
                  <p className="feedback-modal-subtitle">
                    Help us shape and refine TomeSphere platforms
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="feedback-modal-close-btn"
                aria-label="Close feedback dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Status Alert */}
            {status?.type === 'error' && (
              <div className="form-alert-error" role="alert" style={{ marginBottom: '16px' }}>
                <AlertCircle size={15} />
                <span>{status.message}</span>
              </div>
            )}
            {status?.type === 'success' && (
              <div className="form-alert-success" role="status" style={{ marginBottom: '16px' }}>
                <Check size={15} />
                <span>{status.message}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Invisible Honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
                aria-hidden="true"
              />

              {/* Category Picker */}
              <div className="feedback-form-row">
                <label className="form-label" style={{ marginBottom: '8px' }}>
                  What kind of feedback do you have?
                </label>
                <div className="feedback-category-grid" role="radiogroup" aria-label="Feedback category">
                  {FEEDBACK_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setCategory(cat.id)}
                        className={`feedback-category-tile ${isSelected ? 'active' : ''}`}
                      >
                        <Icon size={15} style={{ color: isSelected ? 'inherit' : cat.color }} />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Star Rating */}
              <div className="feedback-form-row">
                <label className="form-label" style={{ marginBottom: '6px' }}>
                  Overall experience rating
                </label>
                <div className="feedback-stars-row" role="radiogroup" aria-label="Rating out of 5 stars">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = (hoverRating || rating) >= starVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        role="radio"
                        aria-checked={rating === starVal}
                        aria-label={`${starVal} star${starVal > 1 ? 's' : ''}`}
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`feedback-star-btn ${isFilled ? 'filled' : ''}`}
                      >
                        <Star size={20} fill={isFilled ? 'currentColor' : 'none'} />
                      </button>
                    );
                  })}
                  <span className="feedback-stars-caption">
                    {rating === 5 && 'Exceptional'}
                    {rating === 4 && 'Great'}
                    {rating === 3 && 'Good'}
                    {rating === 2 && 'Needs Work'}
                    {rating === 1 && 'Critical Issues'}
                  </span>
                </div>
              </div>

              {/* Feedback Textarea */}
              <div className="feedback-form-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <label htmlFor="feedback-message" className="form-label" style={{ margin: 0 }}>
                    Your message <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <span style={{ fontSize: '11px', color: message.length > 1900 ? 'var(--accent-rose)' : 'var(--text-muted)' }}>
                    {message.length}/2000
                  </span>
                </div>
                <textarea
                  id="feedback-message"
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  required
                  placeholder="Tell us what you liked, what broke, or what features you would love to see..."
                  className="form-control"
                />
              </div>

              {/* Optional Name & Email */}
              <div className="feedback-two-col">
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="feedback-name" className="form-label" style={{ marginBottom: '6px' }}>
                    Name <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="feedback-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                    placeholder="Your name"
                    className="form-control"
                    autoComplete="name"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="feedback-email" className="form-label" style={{ marginBottom: '6px' }}>
                    Email <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>(optional, for replies)</span>
                  </label>
                  <input
                    type="email"
                    id="feedback-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={120}
                    placeholder="name@example.com"
                    className="form-control"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="feedback-modal-actions">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary-glass"
                  style={{ padding: '9px 18px', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || message.trim().length < 5}
                  aria-busy={isPending}
                  className="btn-primary-glow"
                  style={{ padding: '9px 22px', fontSize: '13px' }}
                >
                  {isPending ? 'Sending...' : <><Send size={14} /> Send Feedback</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
