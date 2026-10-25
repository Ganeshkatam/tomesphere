import { NextResponse } from 'next/server';
import { feedbackService } from '@/server/services/feedback.service';
import { handleApiError } from '@/server/errors/error-handler';
import { checkRateLimit } from '@/server/middleware/rate-limiter';

export async function POST(request) {
  try {
    const { headers } = checkRateLimit(request, {
      windowMs: 15 * 60 * 1000,
      max: 10,
      keyPrefix: 'feedback'
    });
    const body = await request.json();
    const result = await feedbackService.submitFeedback(body);
    return NextResponse.json({ data: result }, { status: 201, headers });
  } catch (error) {
    return handleApiError(error);
  }
}
