import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { projectRepository } from '../server/repositories/project.repository.js';
import { projectService } from '../server/services/project.service.js';
import { profileRepository } from '../server/repositories/profile.repository.js';
import { updateService } from '../server/services/update.service.js';
import { offerService } from '../server/services/offer.service.js';

const supabaseUrl = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

test('Integration: Live Supabase RLS & Role Privileges', async (t) => {
  if (!supabaseUrl || !anonKey) {
    t.skip('Skipped live Supabase tests: SUPABASE_URL and SUPABASE_ANON_KEY must be provided.');
    return;
  }

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

test('Integration: Product Slug Resolution & Directory Data Integrity', async (t) => {
  if (!supabaseUrl || !anonKey) {
    t.skip('Skipped live product slug tests: SUPABASE_URL and SUPABASE_ANON_KEY must be provided.');
    return;
  }

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

  await t.test('finds projects by permanent slug in database repository', async () => {
    const product = await projectRepository.findBySlug('bookgarden');
    assert.ok(product, 'Expected to find BookGarden by slug');
    assert.equal(product.slug, 'bookgarden');
    assert.equal(product.name, 'BookGarden');
  });

  await t.test('returns null cleanly for nonexistent slugs without database crash', async () => {
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

  await t.test('profileRepository.getProfile projects only public non-sensitive attributes', async () => {
    const profile = await profileRepository.getProfile();
    assert.ok(profile, 'Profile record must exist');
    assert.ok(profile.name, 'Profile must have a name');
    assert.ok(profile.title, 'Profile must have a title');
    assert.equal(profile.service_role, undefined, 'Sensitive internal attributes must never be exposed');
  });

  await t.test('services throw NotFoundError on missing update or offer slugs', async () => {
    await assert.rejects(
      async () => {
        await updateService.getUpdateBySlug('missing-update-slug-xyz');
      },
      (err) => {
        assert.equal(err.code, 'NOT_FOUND');
        return true;
      }
    );

    await assert.rejects(
      async () => {
        await offerService.getOfferBySlug('missing-offer-slug-xyz');
      },
      (err) => {
        assert.equal(err.code, 'NOT_FOUND');
        return true;
      }
    );
  });
});
