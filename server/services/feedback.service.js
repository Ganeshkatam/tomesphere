import { contactRepository } from '../repositories/contact.repository.js';
import { validateFeedbackPayload } from '../validators/feedback.validator.js';

export class FeedbackService {
  async submitFeedback(rawData) {
    const validated = validateFeedbackPayload(rawData);

    const formattedMessage = [
      `[Feedback - ${validated.category}]`,
      validated.rating ? `Rating: ${validated.rating}/5` : null,
      `Message: ${validated.message}`
    ]
      .filter(Boolean)
      .join('\n');

    const result = await contactRepository.saveMessage({
      name: validated.name,
      email: validated.email || 'feedback@tomesphere.in',
      message: formattedMessage
    });

    return {
      id: result.id,
      category: validated.category,
      rating: validated.rating,
      message: validated.message,
      submittedAt: result.receivedAt,
      confirmation: 'Thank you for your feedback! Your insights directly help improve the TomeSphere platform.'
    };
  }
}

export const feedbackService = new FeedbackService();
