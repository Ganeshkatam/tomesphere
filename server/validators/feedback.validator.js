import { ValidationError } from '../errors/api-error.js';

const VALID_CATEGORIES = new Set(['SUGGESTION', 'BUG', 'PRAISE', 'GENERAL']);

export function validateFeedbackPayload(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    throw new ValidationError('Request body must be a JSON object');
  }

  // Honeypot bot protection: automated spam bots fill invisible fields
  if (data.website || data._gotcha || data.honeypot) {
    throw new ValidationError('Automated bot submission detected');
  }

  const rawCategory = typeof data.category === 'string' ? data.category.trim().toUpperCase() : 'GENERAL';
  const category = VALID_CATEGORIES.has(rawCategory) ? rawCategory : 'GENERAL';

  const rawMessage = typeof data.message === 'string' ? data.message.trim() : '';
  if (!rawMessage || rawMessage.length < 5 || rawMessage.length > 2000) {
    errors.push({ field: 'message', message: 'Feedback message must be between 5 and 2000 characters.' });
  }

  let rating = null;
  if (data.rating !== undefined && data.rating !== null && data.rating !== '') {
    const parsedRating = Number(data.rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      errors.push({ field: 'rating', message: 'Rating must be an integer between 1 and 5.' });
    } else {
      rating = parsedRating;
    }
  }

  const name = typeof data.name === 'string' ? data.name.trim().slice(0, 80) : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 120) {
      errors.push({ field: 'email', message: 'Provided email address is invalid.' });
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Feedback validation failed', errors);
  }

  return {
    category,
    message: rawMessage,
    rating,
    name: name || 'Anonymous Explorer',
    email: email || null
  };
}
