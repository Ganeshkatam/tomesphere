import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';
import { validateProjectPayload } from '../server/validators/project.validator.js';
import { validateContactPayload } from '../server/validators/contact.validator.js';
import { validateGuestbookPayload } from '../server/validators/guestbook.validator.js';
import { verifyAdminAuth } from '../server/auth/admin-auth.js';
import { projectRepository } from '../server/repositories/project.repository.js';
import { ForbiddenError, ValidationError } from '../server/errors/api-error.js';

test('Security & Validation: Project Payload Validator', async (t) => {
  await t.test('rejects non-object payloads', () => {
    assert.throws(() => validateProjectPayload(null), ValidationError);
    assert.throws(() => validateProjectPayload('invalid'), ValidationError);
    assert.throws(() => validateProjectPayload([]), ValidationError);
  });

  await t.test('handles featured boolean correctly without Boolean("false") bug', () => {
    const payloadFalseString = {
      name: 'Valid Project',
      url: 'https://example.com',
      description: 'A valid description for testing purposes.',
      featured: 'false'
    };
    const resFalse = validateProjectPayload(payloadFalseString);
    assert.equal(resFalse.featured, false);

    const payloadTrue = {
      name: 'Valid Project',
      url: 'https://example.com',
      description: 'A valid description for testing purposes.',
      featured: 'true'
    };
    const resTrue = validateProjectPayload(payloadTrue);
    assert.equal(resTrue.featured, true);
  });

  await t.test('strictly validates web URLs with http/https schemes', () => {
    const payloadInvalidScheme = {
      name: 'Valid Project',
      url: 'javascript:alert(1)',
      description: 'A valid description for testing purposes.'
    };
    assert.throws(() => validateProjectPayload(payloadInvalidScheme), ValidationError);
  });

  await t.test('distinguishes partial update (PATCH/PUT) from full replacement', () => {
    const partialUpdate = {
      description: 'Updated description for this project.'
    };
    const validated = validateProjectPayload(partialUpdate, true);
    assert.equal(validated.description, 'Updated description for this project.');
    assert.equal(validated.name, undefined);
    assert.equal(validated.url, undefined);
  });

  await t.test('enforces tag array boundaries', () => {
    const tooManyTags = {
      name: 'Valid Project',
      url: 'https://example.com',
      description: 'A valid description for testing purposes.',
      tags: Array.from({ length: 20 }, (_, i) => `tag_${i}`)
    };
    assert.throws(() => validateProjectPayload(tooManyTags), ValidationError);
  });
});

test('Phase 2: Product Slug Resolution & Directory Data Integrity', async (t) => {
  await t.test('retrieves live product by permanent slug (e.g. bookgarden)', async () => {
    const product = await projectRepository.findById('bookgarden');
    assert.ok(product, 'Product should be found by slug');
    assert.equal(product.slug, 'bookgarden');
    assert.equal(product.name, 'BookGarden');
    assert.equal(product.status, 'Live');
    assert.ok(product.url, 'Product must have a URL');
    const launchUrl = product.url.startsWith('http') ? product.url : `https://${product.url}`;
    assert.match(launchUrl, /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}/, 'Launch URL must resolve to valid HTTPS domain');
  });

  await t.test('retrieves live product by permanent id for backward compatibility', async () => {
    const byId = await projectRepository.findById('proj_bookgarden');
    const bySlug = await projectRepository.findById('bookgarden');
    assert.ok(byId, 'Product should be found by id');
    assert.ok(bySlug, 'Product should be found by slug');
    assert.equal(byId.id, bySlug.id);
    assert.equal(byId.name, bySlug.name);
  });

  await t.test('returns null for unknown product slug', async () => {
    const notFoundProduct = await projectRepository.findById('unknown-slug-xyz');
    assert.equal(notFoundProduct, null, 'Unknown slug should resolve to null');
  });

  await t.test('validates all live products have unique slugs and verified launch URLs', async () => {
    const allProducts = await projectRepository.findAll();
    assert.ok(Array.isArray(allProducts));
    assert.ok(allProducts.length > 0, 'Directory should contain products');

    const seenSlugs = new Set();
    for (const prod of allProducts) {
      assert.ok(prod.slug || prod.id, `Product ${prod.name} must have a slug or id`);
      const key = prod.slug || prod.id;
      assert.ok(!seenSlugs.has(key), `Duplicate product slug detected: ${key}`);
      seenSlugs.add(key);

      assert.ok(prod.url, `Product ${prod.name} must have a launch URL`);
      const launchUrl = prod.url.startsWith('http') ? prod.url : `https://${prod.url}`;
      assert.match(launchUrl, /^https?:\/\//, `Launch URL for ${prod.name} must resolve to a valid http(s) URL`);
    }
  });
});

test('Security & Validation: Contact & Guestbook Validators', async (t) => {
  await t.test('validates contact inquiry email and message boundaries', () => {
    assert.throws(() => validateContactPayload({ name: 'A', email: 'invalid', message: 'Hi' }), ValidationError);
    const valid = validateContactPayload({
      name: 'Legit Visitor',
      email: 'visitor@example.com',
      message: 'Hello, this is a legitimate message exceeding five characters.'
    });
    assert.equal(valid.email, 'visitor@example.com');
  });

  await t.test('enforces guestbook message length bounds', () => {
    assert.throws(() => validateGuestbookPayload({ author: 'Alex', message: 'a' }), ValidationError);
    const valid = validateGuestbookPayload({ author: 'Alex', message: 'Great portfolio!' });
    assert.equal(valid.author, 'Alex');
  });
});

test('Security: Admin Authorization Guard', async (t) => {
  process.env.ADMIN_SECRET = 'super-secret-admin-token-1234';

  await t.test('denies unauthenticated requests without admin headers', () => {
    assert.throws(() => verifyAdminAuth({}), ForbiddenError);
  });

  await t.test('denies requests with incorrect credentials', () => {
    assert.throws(() => verifyAdminAuth({ 'x-admin-key': 'wrong-password' }), ForbiddenError);
  });

  await t.test('authorizes requests with correct x-admin-key header', () => {
    assert.equal(verifyAdminAuth({ 'x-admin-key': 'super-secret-admin-token-1234' }), true);
  });

  await t.test('authorizes requests with correct Bearer authorization token', () => {
    assert.equal(verifyAdminAuth({ 'authorization': 'Bearer super-secret-admin-token-1234' }), true);
  });
});

test('Security: Express Admin Middleware', async (t) => {
  process.env.ADMIN_SECRET = 'ci-admin-secret-test';

  const { requireAdminMiddleware } = await import('../server/auth/admin-auth.js');

  await t.test('middleware passes error to next() on unauthenticated request', (t, done) => {
    const req = { headers: {} };
    const res = {};
    requireAdminMiddleware(req, res, (err) => {
      assert.ok(err instanceof ForbiddenError);
      done();
    });
  });

  await t.test('middleware passes error to next() on invalid credential', (t, done) => {
    const req = { headers: { 'x-admin-key': 'bad-token' } };
    const res = {};
    requireAdminMiddleware(req, res, (err) => {
      assert.ok(err instanceof ForbiddenError);
      done();
    });
  });

  await t.test('middleware succeeds with next() without error on valid credential', (t, done) => {
    const req = { headers: { 'x-admin-key': 'ci-admin-secret-test' } };
    const res = {};
    requireAdminMiddleware(req, res, (err) => {
      assert.equal(err, undefined);
      done();
    });
  });
});

test('Security: Live Supabase RLS & Role Privileges', async (t) => {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://ibuaiktnkhvqoqxrqnrz.supabase.co';
  const anonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlidWFpa3Rua2h2cW9xeHJxbnJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NjI1MTYsImV4cCI6MjEwODMzODUxNn0.KTfcNZ_uh693CDWo6QUoh7RY6EbKnOW-rPSbDHVlKjk';

  const anonClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });

  await t.test('anonymous client cannot insert into projects', async () => {
    const { error } = await anonClient.from('projects').insert({
      id: 'unauthorized_hack_test',
      name: 'Malicious Project',
      category: 'WEB APPS',
      description: 'Unauthorized write attempt.',
      url: 'https://malicious.com'
    });
    assert.ok(error, 'Expected error on unauthorized insert to projects');
  });

  await t.test('anonymous client cannot update profile', async () => {
    const { error } = await anonClient.from('profile').update({ name: 'Hacked Name' }).eq('id', 'primary');
    assert.ok(error, 'Expected error on unauthorized update to profile');
  });

  await t.test('anonymous client cannot read contact inquiries', async () => {
    const { data, error } = await anonClient.from('contacts').select('*');
    assert.ok(error, 'Expected permission error when reading contacts as anonymous');
    assert.equal(data, null);
  });

  await t.test('anonymous client can only read Live projects', async () => {
    const { data, error } = await anonClient.from('projects').select('id, name, status');
    assert.equal(error, null);
    assert.ok(Array.isArray(data));
    for (const project of data) {
      assert.equal(project.status, 'Live');
    }
  });

  await t.test('anonymous client cannot insert pre-approved guestbook entries', async () => {
    const { error } = await anonClient.from('guestbook').insert({
      id: 'gb_hack_test',
      author: 'Attacker',
      message: 'Trying to bypass moderation boundary',
      timestamp: 'Today',
      status: 'approved'
    });
    assert.ok(error, 'Expected policy check error when anonymous user attempts to set approved status');
  });

  await t.test('anonymous client cannot insert null status into guestbook', async () => {
    const { error } = await anonClient.from('guestbook').insert({
      id: 'gb_null_test',
      author: 'Tester',
      message: 'Testing null status invariant',
      timestamp: 'Today',
      status: null
    });
    assert.ok(error, 'Expected error when inserting null status into guestbook');
  });

  await t.test('anonymous client cannot update or delete guestbook entries', async () => {
    const updateRes = await anonClient.from('guestbook').update({ message: 'Defaced' }).eq('id', 'gb_test');
    assert.ok(updateRes.error, 'Expected error when anonymous user attempts to update guestbook');

    const deleteRes = await anonClient.from('guestbook').delete().eq('id', 'gb_test');
    assert.ok(deleteRes.error, 'Expected error when anonymous user attempts to delete guestbook');
  });

  await t.test('anonymous client cannot insert, update, or delete updates (mutation revoked & RLS enforced)', async () => {
    const insertRes = await anonClient.from('updates').insert({
      id: 'unauthorized_hack_update',
      slug: 'unauthorized-hack-update',
      project_id: 'proj_bookgarden',
      title: 'Hacked Announcement',
      summary: 'Malicious payload injection attempt.',
      content: 'Should be rejected by database privileges.',
      update_type: 'Launch',
      status: 'Published'
    });
    assert.ok(insertRes.error, 'Expected error on unauthorized insert to updates');

    const updateRes = await anonClient.from('updates').update({ title: 'Defaced' }).eq('id', 'upd_test');
    assert.ok(updateRes.error, 'Expected error on unauthorized update to updates');

    const deleteRes = await anonClient.from('updates').delete().eq('id', 'upd_test');
    assert.ok(deleteRes.error, 'Expected error on unauthorized delete to updates');
  });

  await t.test('anonymous client cannot insert, update, or delete offers (mutation revoked & RLS enforced)', async () => {
    const now = new Date();
    const insertRes = await anonClient.from('offers').insert({
      id: 'unauthorized_hack_offer',
      slug: 'unauthorized-hack-offer',
      project_id: 'proj_bookgarden',
      title: 'Hacked Offer',
      description: 'Malicious offer injection attempt.',
      benefit: 'Free access',
      eligibility: 'Everyone',
      url: 'https://malicious.com',
      start_date: now.toISOString(),
      end_date: new Date(now.getTime() + 86400000).toISOString(),
      status: 'Published'
    });
    assert.ok(insertRes.error, 'Expected error on unauthorized insert to offers');

    const updateRes = await anonClient.from('offers').update({ title: 'Defaced' }).eq('id', 'off_test');
    assert.ok(updateRes.error, 'Expected error on unauthorized update to offers');

    const deleteRes = await anonClient.from('offers').delete().eq('id', 'off_test');
    assert.ok(deleteRes.error, 'Expected error on unauthorized delete to offers');
  });
});

test('Deployment Hygiene: Vercel Preview Deployment Prevention', async (t) => {
  const vercelPath = resolve(process.cwd(), 'vercel.json');

  await t.test('vercel.json configuration exists and parses cleanly', () => {
    assert.ok(existsSync(vercelPath), 'vercel.json must be present in repository root');
    const content = JSON.parse(readFileSync(vercelPath, 'utf-8'));
    assert.ok(content.ignoreCommand, 'ignoreCommand must be defined in vercel.json');
    assert.match(content.ignoreCommand, /VERCEL_ENV/, 'ignoreCommand must inspect VERCEL_ENV');
  });

  await t.test('ignoreCommand skips preview builds (exit 0) and proceeds on production (exit 1)', () => {
    const content = JSON.parse(readFileSync(vercelPath, 'utf-8'));
    const shell = process.platform === 'win32' ? 'bash' : 'sh';

    const previewRun = spawnSync(shell, ['-c', content.ignoreCommand], {
      env: { ...process.env, VERCEL_ENV: 'preview', WSLENV: 'VERCEL_ENV' }
    });
    if (previewRun.error && process.platform === 'win32') {
      return;
    }
    assert.equal(previewRun.status, 0, 'Preview deployments must return exit code 0 to cancel build');

    const prodRun = spawnSync(shell, ['-c', content.ignoreCommand], {
      env: { ...process.env, VERCEL_ENV: 'production', WSLENV: 'VERCEL_ENV' }
    });
    assert.equal(prodRun.status, 1, 'Production deployments must return exit code 1 to proceed with build');
  });
});

test('Phase 1 & A: Product Slug Resolution & Contract Safety', async (t) => {
  const { projectRepository } = await import('../server/repositories/project.repository.js');
  const { validateProjectPayload } = await import('../server/validators/project.validator.js');
  const { projectService } = await import('../server/services/project.service.js');

  await t.test('finds projects by permanent slug in database repository', async () => {
    const product = await projectRepository.findBySlug('bookgarden');
    assert.ok(product, 'Expected to find BookGarden by slug');
    assert.equal(product.slug, 'bookgarden');
    assert.equal(product.name, 'BookGarden');
  });

  await t.test('returns null cleanly for nonexistent slugs or malformed input without database crash', async () => {
    const nonexistent = await projectRepository.findBySlug('definitely-not-a-real-product-slug');
    assert.equal(nonexistent, null);

    const malformed = await projectRepository.findBySlug('bad(slug),or.injection,attempt');
    assert.equal(malformed, null);
  });

  await t.test('projectService.getProjectBySlug throws NotFoundError on missing slug', async () => {
    await assert.rejects(
      async () => {
        await projectService.getProjectBySlug('unknown-missing-slug');
      },
      (err) => {
        assert.equal(err.code, 'NOT_FOUND');
        assert.equal(err.statusCode, 404);
        return true;
      }
    );
  });

  await t.test('validator validates slugs and supports all seed categories', () => {
    const valid = validateProjectPayload({
      name: 'Test Business Product',
      category: 'BUSINESS TOOLS',
      slug: 'test-business-tool',
      description: 'A valid description for business tools.',
      url: 'https://test.tomesphere.in'
    });
    assert.equal(valid.slug, 'test-business-tool');
    assert.equal(valid.category, 'BUSINESS TOOLS');

    assert.throws(
      () => {
        validateProjectPayload({
          name: 'Invalid Slug Product',
          category: 'WEB APPS',
          slug: 'INVALID SLUG WITH SPACES',
          description: 'A valid description.',
          url: 'https://test.tomesphere.in'
        });
      },
      (err) => {
        assert.equal(err.code, 'VALIDATION_ERROR');
        return true;
      }
    );
  });
});

test('Phase B: Production Readiness, Abuse Resistance & Profile Security', async (t) => {
  const { rateLimitMiddleware, checkRateLimit, defaultLimiter } = await import('../server/middleware/rate-limiter.js');
  const { TooManyRequestsError, ApiError } = await import('../server/errors/api-error.js');
  const { validateProfileUpdatePayload } = await import('../server/validators/profile.validator.js');
  const { validateContactPayload } = await import('../server/validators/contact.validator.js');
  const { validateGuestbookPayload } = await import('../server/validators/guestbook.validator.js');
  const { profileRepository } = await import('../server/repositories/profile.repository.js');

  await t.test('honeypot bot detection flags spam submissions in contact and guestbook', () => {
    assert.throws(
      () => validateContactPayload({
        name: 'Spam Bot',
        email: 'spambot@example.com',
        message: 'Buy cheap watches now!',
        website: 'http://spamsite.xyz'
      }),
      (err) => {
        assert.equal(err.code, 'VALIDATION_ERROR');
        assert.match(err.message, /Automated bot submission detected/);
        return true;
      }
    );

    assert.throws(
      () => validateGuestbookPayload({
        author: 'Spam Bot',
        message: 'Spam message',
        honeypot: 'filled_by_bot'
      }),
      (err) => {
        assert.equal(err.code, 'VALIDATION_ERROR');
        assert.match(err.message, /Automated bot submission detected/);
        return true;
      }
    );
  });

  await t.test('rate limiter enforces maximum attempts and sets 429 response headers', () => {
    const testKey = 'test-ip-1234';
    defaultLimiter.reset(testKey);

    // Consume up to max 3
    const r1 = defaultLimiter.consume(testKey, 10000, 3);
    assert.equal(r1.allowed, true);
    assert.equal(r1.remaining, 2);

    const r2 = defaultLimiter.consume(testKey, 10000, 3);
    assert.equal(r2.allowed, true);
    assert.equal(r2.remaining, 1);

    const r3 = defaultLimiter.consume(testKey, 10000, 3);
    assert.equal(r3.allowed, true);
    assert.equal(r3.remaining, 0);

    // Exceed max
    const r4 = defaultLimiter.consume(testKey, 10000, 3);
    assert.equal(r4.allowed, false);
    assert.equal(r4.remaining, 0);
    assert.ok(r4.retryAfter > 0);

    // Clean up
    defaultLimiter.reset(testKey);
  });

  await t.test('Next.js checkRateLimit throws TooManyRequestsError on rate limit breach', () => {
    const mockRequest = {
      headers: {
        get: (h) => (h === 'x-forwarded-for' ? '198.51.100.42' : null)
      }
    };

    const options = { windowMs: 5000, max: 2, keyPrefix: 'test-next' };
    const res1 = checkRateLimit(mockRequest, options);
    assert.equal(res1.headers['X-RateLimit-Remaining'], '1');

    const res2 = checkRateLimit(mockRequest, options);
    assert.equal(res2.headers['X-RateLimit-Remaining'], '0');

    assert.throws(
      () => checkRateLimit(mockRequest, options),
      (err) => {
        assert.ok(err instanceof TooManyRequestsError);
        assert.equal(err.statusCode, 429);
        assert.equal(err.code, 'RATE_LIMIT_EXCEEDED');
        assert.ok(err.retryAfter > 0);
        return true;
      }
    );
  });

  await t.test('profile validator strictly whitelists fields and rejects column injection', () => {
    const valid = validateProfileUpdatePayload({
      name: 'Katam Ganesh Reddy',
      title: 'Systems & Cloud Architect',
      email: 'contact@tomesphere.in',
      is_available: true
    });
    assert.equal(valid.name, 'Katam Ganesh Reddy');
    assert.equal(valid.title, 'Systems & Cloud Architect');
    assert.equal(valid.is_available, true);

    assert.throws(
      () => validateProfileUpdatePayload({
        name: 'Hacker',
        role: 'superadmin',
        raw_sql_column: 'injection'
      }),
      (err) => {
        assert.equal(err.code, 'VALIDATION_ERROR');
        return true;
      }
    );
  });

  await t.test('profile repository getProfile projects only public non-sensitive attributes', async () => {
    const profile = await profileRepository.getProfile();
    assert.ok(profile, 'Profile should exist');
    assert.ok(profile.name, 'Expected profile name');
    assert.ok(profile.title, 'Expected profile title');
    // Ensure internal database metadata is never exposed
    assert.equal(profile.created_at, undefined);
    assert.equal(profile.updated_at, undefined);
  });

  await t.test('distinguishes simulated API outage (500/503) from not-found (404)', () => {
    const notFoundError = new ApiError('Not found', 404, 'NOT_FOUND');
    const outageError = new ApiError('Service Unavailable', 503, 'SERVICE_UNAVAILABLE');

    assert.equal(notFoundError.statusCode, 404);
    assert.notEqual(outageError.statusCode, 404);
    assert.equal(outageError.statusCode, 503);
  });
});

test('Phase C: Updates & Offers Data Contracts, Expiry & Validation', async (t) => {
  const { validateUpdatePayload, ALLOWED_UPDATE_TYPES } = await import('../server/validators/update.validator.js');
  const { validateOfferPayload, ALLOWED_OFFER_STATUSES } = await import('../server/validators/offer.validator.js');
  const { updateService } = await import('../server/services/update.service.js');
  const { offerService } = await import('../server/services/offer.service.js');

  await t.test('updates validator strictly enforces required fields, update types and generates slugs', () => {
    const valid = validateUpdatePayload({
      project_id: 'proj_bookgarden',
      title: 'BookGarden v2.0 Architecture Rewrite',
      summary: 'Complete migration to decoupled REST API and Clean Architecture.',
      content: 'Detailed changelog content describing the release and fixes.',
      version: 'v2.0.0',
      update_type: 'Launch'
    });

    assert.equal(valid.project_id, 'proj_bookgarden');
    assert.equal(valid.slug, 'bookgarden-v2-0-architecture-rewrite');
    assert.equal(valid.update_type, 'Launch');
    assert.equal(valid.status, 'Draft');

    assert.throws(
      () => validateUpdatePayload({
        project_id: 'proj_bookgarden',
        title: 'Valid Title',
        summary: 'Valid summary text.',
        content: 'Valid content.',
        update_type: 'INVALID_TYPE'
      }),
      (err) => {
        assert.equal(err.code, 'VALIDATION_ERROR');
        return true;
      }
    );
  });

  await t.test('offers validator enforces date bounds, benefit statements and valid launch URLs', () => {
    const now = Date.now();
    const valid = validateOfferPayload({
      project_id: 'proj_bookgarden',
      title: 'Early Adopter Lifetime Pro',
      description: 'Exclusive benefit for founding users of BookGarden archive.',
      benefit: 'Lifetime Pro access without monthly renewal',
      eligibility: 'New accounts registered in Q4 2026',
      url: 'https://bookgarden.tomesphere.in/pro',
      start_date: new Date(now).toISOString(),
      end_date: new Date(now + 86400000 * 30).toISOString(),
      status: 'Published'
    });

    assert.equal(valid.project_id, 'proj_bookgarden');
    assert.equal(valid.slug, 'early-adopter-lifetime-pro');
    assert.equal(valid.status, 'Published');

    // Throws when end_date <= start_date
    assert.throws(
      () => validateOfferPayload({
        project_id: 'proj_bookgarden',
        title: 'Invalid Date Range Offer',
        description: 'Testing backwards date interval.',
        benefit: 'Free access',
        eligibility: 'Everyone',
        url: 'https://bookgarden.tomesphere.in',
        start_date: new Date(now + 86400000).toISOString(),
        end_date: new Date(now).toISOString()
      }),
      (err) => {
        assert.equal(err.code, 'VALIDATION_ERROR');
        assert.ok(err.details?.some(d => /end_date must be strictly after start_date/.test(d.message)));
        return true;
      }
    );

    // Throws on malicious URL scheme (e.g. javascript:)
    assert.throws(
      () => validateOfferPayload({
        project_id: 'proj_bookgarden',
        title: 'Malicious URL Offer',
        description: 'Testing URL validation.',
        benefit: 'Free access',
        eligibility: 'Everyone',
        url: 'javascript:alert(document.cookie)',
        start_date: new Date(now).toISOString(),
        end_date: new Date(now + 86400000).toISOString()
      }),
      (err) => {
        assert.equal(err.code, 'VALIDATION_ERROR');
        return true;
      }
    );
  });

  await t.test('services throw NotFoundError on missing update or offer slugs', async () => {
    await assert.rejects(
      async () => {
        await updateService.getUpdateBySlug('missing-nonexistent-update-slug');
      },
      (err) => {
        assert.equal(err.code, 'NOT_FOUND');
        assert.equal(err.statusCode, 404);
        return true;
      }
    );

    await assert.rejects(
      async () => {
        await offerService.getOfferBySlug('missing-nonexistent-offer-slug');
      },
      (err) => {
        assert.equal(err.code, 'NOT_FOUND');
        assert.equal(err.statusCode, 404);
        return true;
      }
    );
  });

  await t.test('Next.js requireAdminRequest rejects unauthenticated and invalid mutation requests', async () => {
    const { requireAdminRequest } = await import('../server/auth/admin-auth.js');
    process.env.ADMIN_SECRET = 'ci-admin-secret-test';

    const unauthenticatedReq = {
      headers: {
        get: () => null,
        forEach: () => {}
      }
    };
    assert.throws(() => requireAdminRequest(unauthenticatedReq), ForbiddenError);

    const invalidReq = {
      headers: {
        get: (h) => (h === 'x-admin-key' ? 'incorrect-token' : null)
      }
    };
    assert.throws(() => requireAdminRequest(invalidReq), ForbiddenError);

    const validReq = {
      headers: {
        get: (h) => (h === 'x-admin-key' ? 'ci-admin-secret-test' : null)
      }
    };
    assert.equal(requireAdminRequest(validReq), true);
  });

  await t.test('migration SQL contract strictly defines schema, check constraints, RLS and temporal publication policies', () => {
    const migrationPath = resolve(process.cwd(), 'supabase/migrations/20261024_create_updates_and_offers.sql');
    assert.ok(existsSync(migrationPath), 'Migration SQL must exist');
    const sql = readFileSync(migrationPath, 'utf-8');

    // Schema existence
    assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.updates'));
    assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.offers'));

    // Check constraints
    assert.ok(sql.includes("CONSTRAINT check_update_type CHECK (update_type IN ('Launch', 'Feature', 'Improvement', 'Bugfix', 'Maintenance'))"));
    assert.ok(sql.includes("CONSTRAINT check_update_status CHECK (status IN ('Published', 'Draft', 'Archived'))"));
    assert.ok(sql.includes('CONSTRAINT check_offer_dates CHECK (end_date > start_date)'));
    assert.ok(sql.includes("CONSTRAINT check_offer_status CHECK (status IN ('Published', 'Draft', 'Expired'))"));

    // RLS enabled and all mutations and administrative privileges revoked
    assert.ok(sql.includes('ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;'));
    assert.ok(sql.includes('ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;'));
    assert.ok(sql.includes('REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.updates FROM anon, authenticated;'));
    assert.ok(sql.includes('REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.offers FROM anon, authenticated;'));

    // Check dedicated remediation migration exists
    const remediationMigrationPath = resolve(process.cwd(), 'supabase/migrations/20261025_revoke_dangerous_public_privileges.sql');
    assert.ok(existsSync(remediationMigrationPath), 'Remediation migration must exist');
    const remSql = readFileSync(remediationMigrationPath, 'utf-8');
    assert.ok(remSql.includes('REVOKE TRUNCATE, TRIGGER, REFERENCES ON public.updates FROM anon, authenticated;'));
    assert.ok(remSql.includes('REVOKE TRUNCATE, TRIGGER, REFERENCES ON public.offers FROM anon, authenticated;'));

    // Temporal publication and expiry policies
    assert.ok(sql.includes("status = 'Published' AND published_at <= NOW()"), 'Must enforce published_at <= NOW() on updates');
    assert.ok(sql.includes("status = 'Published' AND start_date <= NOW() AND end_date >= NOW()"), 'Must enforce start_date <= NOW() AND end_date >= NOW() on offers');
  });

  await t.test('publication and expiry rules: validates draft/archived status isolation and rejects offers with no expiry date', () => {
    // Updates status validation: rejects arbitrary status
    assert.throws(
      () => validateUpdatePayload({
        project_id: 'proj_bookgarden',
        title: 'Valid Update Title',
        summary: 'Valid summary text.',
        content: 'Valid content.',
        status: 'UnapprovedStatus'
      }),
      (err) => {
        assert.equal(err.code, 'VALIDATION_ERROR');
        return true;
      }
    );

    // Offers without expiry end_date are strictly rejected
    assert.throws(
      () => validateOfferPayload({
        project_id: 'proj_bookgarden',
        title: 'Indefinite Offer With No Expiry',
        description: 'Should fail because end_date is required.',
        benefit: 'Free access',
        eligibility: 'Everyone',
        url: 'https://bookgarden.tomesphere.in'
      }),
      (err) => {
        assert.equal(err.code, 'VALIDATION_ERROR');
        assert.ok(err.details?.some(d => /end_date is required/.test(d.message)));
        return true;
      }
    );
  });
});


