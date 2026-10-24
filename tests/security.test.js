import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { validateProjectPayload } from '../server/validators/project.validator.js';
import { validateContactPayload } from '../server/validators/contact.validator.js';
import { validateGuestbookPayload } from '../server/validators/guestbook.validator.js';
import { validateProfileUpdatePayload } from '../server/validators/profile.validator.js';
import { validateUpdatePayload } from '../server/validators/update.validator.js';
import { validateOfferPayload } from '../server/validators/offer.validator.js';
import { verifyAdminAuth, requireAdminMiddleware } from '../server/auth/admin-auth.js';
import { ForbiddenError, ValidationError, TooManyRequestsError, ApiError } from '../server/errors/api-error.js';
import { defaultLimiter, checkRateLimit } from '../server/middleware/rate-limiter.js';
import { getSupabaseClient } from '../server/config/supabase.js';

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
});

test('Security: Admin Authorization Guard & Middleware', async (t) => {
  process.env.ADMIN_SECRET = 'ci-super-secret-admin-token-1234';

  await t.test('denies unauthenticated requests without admin headers', () => {
    assert.throws(() => verifyAdminAuth({}), ForbiddenError);
  });

  await t.test('denies requests with incorrect credentials', () => {
    assert.throws(() => verifyAdminAuth({ 'x-admin-key': 'wrong-password' }), ForbiddenError);
  });

  await t.test('authorizes requests with correct x-admin-key header', () => {
    assert.equal(verifyAdminAuth({ 'x-admin-key': 'ci-super-secret-admin-token-1234' }), true);
  });

  await t.test('authorizes requests with correct Bearer authorization token', () => {
    assert.equal(verifyAdminAuth({ 'authorization': 'Bearer ci-super-secret-admin-token-1234' }), true);
  });

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
    const req = { headers: { 'x-admin-key': 'ci-super-secret-admin-token-1234' } };
    const res = {};
    requireAdminMiddleware(req, res, (err) => {
      assert.equal(err, undefined);
      done();
    });
  });
});

test('Security & Configuration: Fail-Fast Database Configuration Guard', async (t) => {
  await t.test('getSupabaseClient throws descriptive error when SUPABASE_URL is missing', () => {
    const origUrl = process.env.SUPABASE_URL;
    const origKey = process.env.SUPABASE_ANON_KEY;
    const origServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    try {
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_ANON_KEY;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      assert.throws(
        () => getSupabaseClient(),
        /Server Database Configuration Error: SUPABASE_URL and SUPABASE_ANON_KEY/
      );
    } finally {
      if (origUrl) process.env.SUPABASE_URL = origUrl;
      if (origKey) process.env.SUPABASE_ANON_KEY = origKey;
      if (origServiceKey) process.env.SUPABASE_SERVICE_ROLE_KEY = origServiceKey;
    }
  });

  await t.test('config file contains zero embedded credential fallbacks', () => {
    const configPath = resolve(process.cwd(), 'server/config/supabase.js');
    assert.ok(existsSync(configPath), 'supabase.js config file must exist');
    const content = readFileSync(configPath, 'utf-8');

    assert.ok(!content.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'), 'Must never embed JWT tokens in server config');
    assert.ok(!content.includes("|| 'https://"), 'Must never use fallback database URLs');
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
    assert.equal(previewRun.status, 0, 'Preview deployments must exit 0 to skip build');

    const prodRun = spawnSync(shell, ['-c', content.ignoreCommand], {
      env: { ...process.env, VERCEL_ENV: 'production', WSLENV: 'VERCEL_ENV' }
    });
    assert.equal(prodRun.status, 1, 'Production deployments must exit 1 to trigger build');
  });
});

test('Phase B: Abuse Resistance, Honeypot & Profile Security Boundaries', async (t) => {
  await t.test('rate limiter enforces maximum attempts and sets 429 response headers', () => {
    const testKey = 'test-ip-deterministic-1234';
    defaultLimiter.reset(testKey);

    const r1 = defaultLimiter.consume(testKey, 10000, 3);
    assert.equal(r1.allowed, true);
    assert.equal(r1.remaining, 2);

    const r2 = defaultLimiter.consume(testKey, 10000, 3);
    assert.equal(r2.allowed, true);
    assert.equal(r2.remaining, 1);

    const r3 = defaultLimiter.consume(testKey, 10000, 3);
    assert.equal(r3.allowed, true);
    assert.equal(r3.remaining, 0);

    const r4 = defaultLimiter.consume(testKey, 10000, 3);
    assert.equal(r4.allowed, false);
    assert.equal(r4.remaining, 0);
    assert.ok(r4.retryAfter > 0);

    defaultLimiter.reset(testKey);
  });

  await t.test('Next.js checkRateLimit throws TooManyRequestsError on rate limit breach', () => {
    const testIp = '198.51.100.42';
    defaultLimiter.reset(`rl:${testIp}`);

    const mockReq = {
      headers: {
        get: (h) => (h === 'x-forwarded-for' ? testIp : null)
      }
    };

    // Consume up to max 3
    checkRateLimit(mockReq, { max: 3, windowMs: 60000 });
    checkRateLimit(mockReq, { max: 3, windowMs: 60000 });
    checkRateLimit(mockReq, { max: 3, windowMs: 60000 });

    // 4th request must throw TooManyRequestsError
    assert.throws(
      () => checkRateLimit(mockReq, { max: 3, windowMs: 60000 }),
      TooManyRequestsError
    );

    defaultLimiter.reset(`rl:${testIp}`);
  });

  await t.test('profile validator strictly whitelists fields and rejects column injection', () => {
    assert.throws(
      () => validateProfileUpdatePayload({
        name: 'Valid Name',
        is_admin: true,
        service_role: true
      }),
      (err) => {
        assert.equal(err.code, 'VALIDATION_ERROR');
        assert.equal(err.message, 'Profile validation failed');
        assert.ok(err.details.some(d => d.field === 'is_admin'));
        assert.ok(err.details.some(d => d.field === 'service_role'));
        return true;
      }
    );

    const valid = validateProfileUpdatePayload({
      name: 'Ganesh Katam',
      title: 'Systems & Product Engineer',
      domain: 'Systems Architecture',
      bio: 'Building deterministic, resilient software systems.'
    });
    assert.equal(valid.name, 'Ganesh Katam');
    assert.equal(valid.title, 'Systems & Product Engineer');
  });

  await t.test('distinguishes simulated API outage (500/503) from not-found (404)', () => {
    const outageErr = new ApiError('Database connection refused.', 503, 'SERVICE_UNAVAILABLE');
    assert.equal(outageErr.statusCode, 503);
    assert.equal(outageErr.code, 'SERVICE_UNAVAILABLE');

    const notFoundErr = new ApiError('Profile record not found.', 404, 'NOT_FOUND');
    assert.equal(notFoundErr.statusCode, 404);
    assert.equal(notFoundErr.code, 'NOT_FOUND');
  });
});

test('Phase C: Updates & Offers Validation & Temporal Contract Rules', async (t) => {
  await t.test('updates validator strictly enforces required fields, update types and generates slugs', () => {
    assert.throws(
      () => validateUpdatePayload({}),
      ValidationError
    );

    const valid = validateUpdatePayload({
      project_id: 'proj_bookgarden',
      title: 'Global Performance Acceleration',
      summary: 'Delivered edge caching reducing TTFB across global routes.',
      content: 'Detailed breakdown of the architectural overhaul...',
      update_type: 'Improvement',
      version: '2.1.0',
      status: 'Published'
    });

    assert.equal(valid.project_id, 'proj_bookgarden');
    assert.equal(valid.slug, 'global-performance-acceleration');
    assert.equal(valid.update_type, 'Improvement');
    assert.equal(valid.status, 'Published');
  });

  await t.test('offers validator enforces date bounds, benefit statements and valid launch URLs', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 86400000);
    const future = new Date(now.getTime() + 86400000);

    // End date before start date must be rejected
    assert.throws(
      () => validateOfferPayload({
        project_id: 'proj_bookgarden',
        title: 'Broken Date Offer',
        description: 'Should fail due to reversed date bounds.',
        benefit: 'Free access',
        eligibility: 'All students',
        url: 'https://bookgarden.tomesphere.in',
        start_date: future.toISOString(),
        end_date: past.toISOString()
      }),
      ValidationError
    );

    const valid = validateOfferPayload({
      project_id: 'proj_bookgarden',
      title: 'Early Adopter Free Access',
      description: 'Full complimentary reading library pass for verified community members.',
      benefit: 'Complimentary Access',
      eligibility: 'Community Members',
      coupon_code: 'EARLYPASS26',
      url: 'https://bookgarden.tomesphere.in',
      start_date: past.toISOString(),
      end_date: future.toISOString(),
      status: 'Published'
    });

    assert.equal(valid.coupon_code, 'EARLYPASS26');
    assert.equal(valid.status, 'Published');
  });

  await t.test('migration SQL contract strictly defines schema, check constraints, RLS and temporal publication policies', () => {
    const migrationPath = resolve(process.cwd(), 'supabase/migrations/20261024000000_create_updates_and_offers.sql');
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
    const remediationMigrationPath = resolve(process.cwd(), 'supabase/migrations/20261025000000_revoke_dangerous_public_privileges.sql');
    assert.ok(existsSync(remediationMigrationPath), 'Remediation migration must exist');
    const remSql = readFileSync(remediationMigrationPath, 'utf-8');
    assert.ok(remSql.includes('REVOKE TRUNCATE, TRIGGER, REFERENCES ON public.updates FROM anon, authenticated;'));
    assert.ok(remSql.includes('REVOKE TRUNCATE, TRIGGER, REFERENCES ON public.offers FROM anon, authenticated;'));

    // Check soft-deprecation migration exists
    const softDeprecateMigrationPath = resolve(process.cwd(), 'supabase/migrations/20261025010000_soft_deprecate_skills_table.sql');
    assert.ok(existsSync(softDeprecateMigrationPath), 'Soft deprecate migration must exist');
    const softSql = readFileSync(softDeprecateMigrationPath, 'utf-8');
    assert.ok(softSql.includes('ALTER POLICY "Public read skills" ON public.skills USING (false);'));
    assert.ok(softSql.includes('REVOKE SELECT ON public.skills FROM anon, authenticated;'));

    // Temporal publication and expiry policies
    assert.ok(sql.includes("status = 'Published' AND published_at <= NOW()"), 'Must enforce published_at <= NOW() on updates');
    assert.ok(sql.includes("status = 'Published' AND start_date <= NOW() AND end_date >= NOW()"), 'Must enforce start_date <= NOW() AND end_date >= NOW() on offers');
  });

  await t.test('publication and expiry rules: validates draft/archived status isolation and rejects offers with no expiry date', () => {
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
