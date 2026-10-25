'use client';

import React, { useState } from 'react';
import { Send, Check, MessageSquare, Lightbulb, Heart, MessageCircle, Filter } from 'lucide-react';
import { apiClient } from '../lib/api-client';

const CATEGORIES = [
  { id: 'GENERAL', label: 'General', icon: MessageCircle, color: 'var(--text-secondary)' },
  { id: 'FEEDBACK', label: 'Feedback', icon: MessageSquare, color: 'var(--accent-cyan)' },
  { id: 'IDEA', label: 'Idea', icon: Lightbulb, color: 'var(--accent-amber)' },
  { id: 'GREETING', label: 'Greeting', icon: Heart, color: 'var(--accent-rose)' }
];

export default function GuestbookClient({ initialEntries = [] }) {
  const [guestbook, setGuestbook] = useState(initialEntries || []);
  const [gbState, setGbState] = useState(null);
  const [gbPending, setGbPending] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('FEEDBACK');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [messageLength, setMessageLength] = useState(0);

  const handleGuestbookSubmit = async (e) => {
    e.preventDefault();
    setGbPending(true);
    setGbState(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      author: fd.get('author'),
      message: fd.get('message'),
      category: selectedCategory,
      website: fd.get('website') // honeypot
    };

    try {
      const res = await apiClient.guestbook.create(payload);
      setGbState({ success: true });
      setGuestbook(prev => [res, ...prev]);
      setMessageLength(0);
      e.target.reset();
    } catch (err) {
      setGbState({ error: err.message || 'Failed to post guestbook entry.' });
    } finally {
      setGbPending(false);
    }
  };

  const filteredEntries = guestbook.filter(entry => {
    if (activeFilter === 'ALL') return true;
    return (entry.category || 'GENERAL').toUpperCase() === activeFilter;
  });

  const getCategoryMeta = (catId = 'GENERAL') => {
    const key = (catId || 'GENERAL').toUpperCase();
    return CATEGORIES.find(c => c.id === key) || CATEGORIES[0];
  };

  return (
    <div className="guestbook-wrapper">
      <div className="guestbook-form-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, margin: 0 }}>
            Sign the Guestbook
          </h3>
          <span className="guestbook-counter-badge">
            {guestbook.length} Community {guestbook.length === 1 ? 'Note' : 'Notes'}
          </span>
        </div>

        {gbState?.error && <div className="form-alert-error" role="alert">{gbState.error}</div>}
        {gbState?.success && (
          <div className="form-alert-success" role="status" aria-live="polite">
            <Check size={14} /> Thank you! Your note has been submitted for review and will appear after approval.
          </div>
        )}

        <form onSubmit={handleGuestbookSubmit}>
          {/* Honeypot field for bot protection */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
            aria-hidden="true"
          />

          <div className="form-group">
            <label className="form-label">Note Category</label>
            <div className="guestbook-category-picker" role="radiogroup" aria-label="Select note category">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`guestbook-cat-btn ${isSelected ? 'active' : ''}`}
                  >
                    <Icon size={13} style={{ color: isSelected ? 'inherit' : cat.color }} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="guestbook-author">Your Name or Handle</label>
            <input
              type="text"
              id="guestbook-author"
              name="author"
              autoComplete="nickname"
              className="form-control"
              placeholder="e.g. Alex"
              maxLength={50}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <label className="form-label" htmlFor="guestbook-message" style={{ margin: 0 }}>Message</label>
              <span style={{ fontSize: '11px', color: messageLength > 280 ? 'var(--accent-rose)' : 'var(--text-muted)' }}>
                {messageLength}/300
              </span>
            </div>
            <textarea
              id="guestbook-message"
              name="message"
              rows="3"
              className="form-control"
              placeholder="Leave a thought, greeting, or feedback..."
              maxLength={300}
              onChange={(e) => setMessageLength(e.target.value.length)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={gbPending}
            aria-busy={gbPending}
            className="btn-primary-glow"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {gbPending ? 'Posting...' : <><Send size={15} /> Sign Guestbook</>}
          </button>
        </form>
      </div>

      <div className="guestbook-feed-container">
        <div className="guestbook-filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <Filter size={13} />
            <span>Filter:</span>
          </div>
          <div className="guestbook-filter-pills">
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className={`guestbook-filter-pill ${activeFilter === 'ALL' ? 'active' : ''}`}
            >
              All ({guestbook.length})
            </button>
            {CATEGORIES.map(cat => {
              const count = guestbook.filter(e => (e.category || 'GENERAL').toUpperCase() === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveFilter(cat.id)}
                  className={`guestbook-filter-pill ${activeFilter === cat.id ? 'active' : ''}`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="guestbook-feed">
          {filteredEntries.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', background: 'var(--bg-surface-glass)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {activeFilter === 'ALL' ? 'No guestbook entries yet' : `No entries under ${activeFilter}`}
              </p>
              <p style={{ fontSize: '13px' }}>Be the first to sign and leave a note above.</p>
            </div>
          ) : (
            filteredEntries.map(entry => {
              const catMeta = getCategoryMeta(entry.category);
              const CatIcon = catMeta.icon;
              return (
                <div key={entry.id} className="guestbook-entry">
                  <div className="guestbook-entry-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="guestbook-author">{entry.author}</span>
                      <span className={`guestbook-cat-tag cat-${(entry.category || 'general').toLowerCase()}`}>
                        <CatIcon size={10} />
                        {catMeta.label}
                      </span>
                    </div>
                    <span>{entry.timestamp || (entry.created_at ? new Date(entry.created_at).toLocaleDateString() : '')}</span>
                  </div>
                  <div className="guestbook-body">{entry.message}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
