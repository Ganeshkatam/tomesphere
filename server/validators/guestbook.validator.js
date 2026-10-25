import { ValidationError } from '../errors/api-error.js';

export function validateGuestbookPayload(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    throw new ValidationError('Request body must be a JSON object');
  }

  // Honeypot bot protection: automated spam bots fill invisible fields
  if (data.website || data._gotcha || data.honeypot) {
    throw new ValidationError('Automated bot submission detected');
  }

  const author = typeof data.author === 'string' ? data.author.trim() : 'Explorer';
  const message = typeof data.message === 'string' ? data.message.trim() : '';

  if (author.length > 50) {
    errors.push({ field: 'author', message: 'Author name cannot exceed 50 characters.' });
  }

  if (!message || message.length < 3 || message.length > 300) {
    errors.push({ field: 'message', message: 'Message must be between 3 and 300 characters.' });
  }

  const rawCategory = typeof data.category === 'string' ? data.category.trim().toUpperCase() : 'GENERAL';
  const validCategories = new Set(['GENERAL', 'FEEDBACK', 'IDEA', 'GREETING']);
  const category = validCategories.has(rawCategory) ? rawCategory : 'GENERAL';

  if (errors.length > 0) {
    throw new ValidationError('Guestbook validation failed', errors);
  }

  return {
    author: author || 'Explorer',
    message,
    category
  };
}
