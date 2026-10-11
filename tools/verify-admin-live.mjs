// Live integration check. Uses only its own temporary document and image; keeps the requested admin account.
import assert from 'node:assert/strict';
import { randomUUID, randomBytes } from 'node:crypto';
import { deflateSync } from 'node:zlib';
import { writeFile } from 'node:fs/promises';
import { createClient } from 'next-sanity';

const expectedProject = process.argv[process.argv.indexOf('--project') + 1];
if (!process.argv.includes('--project') || expectedProject !== process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
  throw new Error('Pass --project with the verified customer project ID before performing live writes.');
const required = ['NEXT_PUBLIC_SANITY_DATASET', 'SANITY_API_WRITE_TOKEN', 'ADMIN_EMAIL', 'ADMIN_INITIAL_PASSWORD'];
for (const key of required) if (!process.env[key]) throw new Error(`Missing ${key}`);
const base = process.env.IVY_VERIFY_URL || 'http://127.0.0.1:3015';
const client = createClient({ projectId: expectedProject, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN, apiVersion: '2025-02-19', useCdn: false, perspective: 'raw' });
const id = randomUUID(), slug = `integration-check-${id}`;
const checks = [];
let cookie = '', assetId;
const pass = (check) => { checks.push(check); console.log(`PASS ${check}`); };
async function call(path, { method = 'GET', body, multipart } = {}) {
  const r = await fetch(`${base}${path}`, { method, redirect: 'manual', headers: {
    ...(cookie ? { Cookie: cookie } : {}),
    ...(method !== 'GET' ? { Origin: base, 'x-ivy-admin-request': '1' } : {}),
    ...(body ? { 'Content-Type': 'application/json' } : {}),
  }, body: multipart || (body ? JSON.stringify(body) : undefined) });
  const text = await r.text();
  const data = r.headers.get('content-type')?.includes('application/json') ? JSON.parse(text) : null;
  assert.ok(r.status < 400, `${method} ${path}: ${r.status} ${data?.error || ''}`);
  return { r, text, data };
}
try {
  const anonymous = await fetch(`${base}/admin/content`, { redirect: 'manual' });
  assert.equal(anonymous.status, 401); pass('Anonymous content access denied');
  const login = await call('/admin/session', { method: 'POST', body: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_INITIAL_PASSWORD } });
  assert.equal(login.data.email, process.env.ADMIN_EMAIL);
  cookie = login.r.headers.get('set-cookie')?.split(';')[0]; assert.ok(cookie); pass('Requested account logs in and receives a session');
  const workspace = await call('/admin');
  assert.ok(workspace.text.includes('글 관리')); pass('Authenticated workspace opens');
  const upload = new FormData();
  // Unique valid PNG, so cleanup cannot remove a pre-existing deduplicated asset.
  const chunk = (type, data) => {
    const payload = Buffer.concat([Buffer.from(type), data]);
    let crc = 0xffffffff;
    for (const byte of payload) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    const length = Buffer.alloc(4), checksum = Buffer.alloc(4);
    length.writeUInt32BE(data.length); checksum.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
    return Buffer.concat([length, payload, checksum]);
  };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(4, 0); ihdr.writeUInt32BE(4, 4); ihdr[8] = 8; ihdr[9] = 2;
  const pixels = Buffer.concat(Array.from({ length: 4 }, () => Buffer.concat([Buffer.from([0]), randomBytes(12)])));
  const png = Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(pixels)), chunk('IEND', Buffer.alloc(0))]);
  upload.set('file', new Blob([png], { type: 'image/png' }), 'ivybloom-integration-test.png');
  const media = await call('/admin/assets', { method: 'POST', multipart: upload });
  assetId = media.data.asset._id; assert.ok(assetId); pass('Image uploaded into the customer project');
  const document = { _id: id, _type: 'journalPost', title: 'Ivy Bloom integration verification', slug: { _type: 'slug', current: slug }, category: 'college',
    publishedAt: new Date().toISOString(), author: 'IVY BLOOM CONSULTING', excerpt: 'Temporary integration verification.', noindex: true,
    mainImage: { _type: 'image', asset: { _type: 'reference', _ref: assetId }, alt: 'Integration verification image' },
    body: [{ _type: 'block', _key: 'body', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 'text', marks: [], text: 'Temporary verification of the connected Ivy Bloom content system.' }] }],
    faqSection: [{ _type: 'faqItem', _key: 'faq', question: 'What is being verified?', answer: 'The customer content storage and public rendering connection.' }] };
  const draft = await call('/admin/content', { method: 'POST', body: { document } });
  assert.equal(draft.data.document.mainImage.asset._ref, assetId); pass('Draft and image reference saved and read back');
  const hiddenDraft = await fetch(`${base}/articles/${slug}`); assert.equal(hiddenDraft.status, 404); pass('Unpublished draft is absent from public pages');
  const published = await call('/admin/publish', { method: 'POST', body: { id, revision: draft.data.document._rev } });
  assert.equal(published.data.document._id, id); pass('Draft publishes through the authenticated admin API');
  const page = await call(`/articles/${slug}`);
  assert.ok(page.text.includes(document.title)); assert.ok(page.text.includes(document.body[0].children[0].text));
  assert.ok(page.text.includes(document.faqSection[0].question));
  assert.ok(page.text.includes(`https://ivybloomconsulting.com/articles/${slug}`)); assert.ok(page.text.includes('application/ld+json'));
  assert.ok(page.text.includes('noindex')); pass('Published title, body, FAQ, canonical, structured data and search exclusion render');
  const sitemap = await call('/sitemap.xml'); assert.ok(!sitemap.text.includes(slug)); pass('Search-excluded verification article is absent from sitemap');
  const editedTitle = 'Ivy Bloom integration verification updated';
  const editDraft = await call('/admin/content', { method: 'POST', body: {
    document: { ...document, title: editedTitle }, expectedRevision: published.data.document._rev,
  } });
  const beforeRepublish = await call(`/articles/${slug}`);
  assert.ok(beforeRepublish.text.includes(document.title));
  assert.ok(!beforeRepublish.text.includes(editedTitle)); pass('Draft edits remain private until publication');
  const updated = await call('/admin/publish', { method: 'POST', body: {
    id, revision: editDraft.data.document._rev, publishedRevision: published.data.document._rev,
  } });
  assert.equal(updated.data.document.title, editedTitle);
  const updatedPage = await call(`/articles/${slug}`);
  assert.ok(updatedPage.text.includes(editedTitle)); pass('Republished edits appear on the public page');
  const source = await call('/admin/content'); const state = source.data.states[id]; assert.ok(state?.publishedRev);
  await call('/admin/content', { method: 'DELETE', body: { targets: [{ id, publishedRev: state.publishedRev, draftRev: state.draftRev }] } });
  const deleted = await fetch(`${base}/articles/${slug}`); assert.equal(deleted.status, 404); pass('Only the temporary article is deleted and its public page disappears');
  await call('/admin/session', { method: 'DELETE' }); cookie = '';
  await writeFile('/private/tmp/ivybloom-admin-live-verification.json', JSON.stringify({ baseUrl: base, projectId: expectedProject, verifiedAt: new Date().toISOString(), checks }, null, 2));
} finally {
  // Never select existing customer content. Cleanup IDs were created in this run.
  for (const temporaryId of [id, `drafts.${id}`]) {
    const doc = await client.getDocument(temporaryId);
    if (doc) { assert.equal(doc._type, 'journalPost'); await client.delete(temporaryId); }
  }
  if (assetId) await client.delete(assetId);
}
