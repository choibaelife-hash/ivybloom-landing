// Real service/route contracts with fixture responses only. No secrets, network or writes.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import ts from 'typescript';
const env = {}, calls = [];
let reply = () => Response.json({});
function load(file, imports = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(file, 'utf8'), { fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(code, { exports, process: { env }, Buffer, Response, Request, URL, AbortSignal, Date, FormData, Blob, ...globals, fetch: async (url, options) => { calls.push({ url, options }); return reply(); }, require(name) { if (name === 'server-only') return {}; if (name in imports) return imports[name]; throw Error(name); } });
  return exports;
}
const errors = load('lib/admin/service-error.ts');
const image = load('lib/admin/ai-image.ts', { './service-error': errors, 'node:crypto': crypto });
assert.throws(() => image.validateImageInput({ prompt: '' })); assert.throws(() => image.validateImageInput({ title: 'Reading', prompt: 'x'.repeat(1501) }));
const input = image.validateImageInput({ prompt: 'A study desk', title: 'Reading' });
await assert.rejects(image.generateImage(input), /설정/);
env.OPENAI_API_KEY = 'fixture-key';
reply = () => Response.json({ data: [{ b64_json: Buffer.from([255, 216, 255, 224, 0, 1]).toString('base64') }] });
const generated = await image.generateImage(input);
assert.match(generated.dataUrl, /^data:image\/jpeg;base64,/); assert.match(generated.name, /\.jpg$/);
const body = JSON.parse(calls.at(-1).options.body); assert.equal(body.n, 1); assert.equal(body.output_format, 'jpeg'); assert.equal(body.size, '1024x1024');
const referenceImage = 'data:image/png;base64,' + Buffer.from([137,80,78,71,13,10,26,10,0,0,0,0]).toString('base64');
const editInput = image.validateImageInput({ title: 'Reading', prompt: 'Change only the headline', referenceImage });
await image.generateImage(editInput);
assert.equal(calls.at(-1).url, 'https://api.openai.com/v1/images/edits');
const editBody = calls.at(-1).options.body;
assert.ok(editBody instanceof FormData);
assert.equal(editBody.get('image[]').type, 'image/png');
assert.equal(editBody.get('size'), '1024x1024');
assert.match(editBody.get('prompt'), /Follow the user.s additional visual request/);
assert.ok(!editBody.get('prompt').includes(referenceImage));
assert.equal(calls.at(-1).options.headers['Content-Type'], undefined);
assert.throws(() => image.validateImageInput({ title: 'Reading', referenceImage: 'https://example.com/image.png' }));
assert.throws(() => image.validateImageInput({ title: 'Reading', referenceImage: 'data:image/png;base64,' + Buffer.from('not an image').toString('base64') }));
reply = () => Response.json({ data: [{ b64_json: Buffer.from('not an image').toString('base64') }] }); await assert.rejects(image.generateImage(input), /JPEG/);
let allowed = false, writes = [], generationCount = 0;
const auth = { guard: async (_request, write) => { writes.push(write); if (!allowed) throw new Error('unauthorized'); return { email: 'fixture@test' }; }, failure: () => Response.json({ error: 'unauthorized' }, { status: 401 }) };
const route = load('app/admin/ai/image/route.ts', { '@/lib/admin/sanity-server': auth, '@/lib/admin/service-error': errors, '@/lib/admin/ai-image': { validateImageInput: image.validateImageInput, generateImage: async () => { generationCount++; return generated; } } });
const req = (prompt, title = 'Reading') => new Request('http://localhost/admin/ai/image', { method: 'POST', body: JSON.stringify({ prompt, title }) });
assert.equal((await route.POST(req('desk'))).status, 401); assert.equal(generationCount, 0); assert.equal(writes.at(-1), true);
allowed = true;
assert.equal((await route.POST(req('', ''))).status, 400); assert.equal(generationCount, 0);
for (let i = 0; i < 10; i++) assert.equal((await route.POST(req('desk'))).status, 200);
assert.equal((await route.POST(req('desk'))).status, 429); assert.equal(generationCount, 10);
// Exercise the actual client request through the existing origin guard and explicit apply.
const authModule = load('lib/admin/auth.ts', { 'next-sanity': {}, 'node:crypto': crypto });
env.NODE_ENV = 'development';
const jsx = { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
let pendingWrites = 0, hook = 0, previewState;
const component = load('components/admin/ImageGenerator.tsx', {
  react: { useState: () => { const i = hook++; return [i === 0 ? 'A desk' : i === 1 ? false : i === 4 ? previewState : '', v => { if (i === 4) previewState = v; }]; } },
  '@/lib/admin/image-client': { optimizeCover: async (dataUrl, name) => ({ dataUrl, name, bytes: 100, width: 1024, height: 1024 }) }, 'react/jsx-runtime': jsx, './HelpTip': { default: () => null }, './local-studio.module.css': { default: {} },
}).default;
const props = { title: 'Reading', summary: 'Practice', body: [{ children: [{ text: 'Verified article facts' }] }], context: { setPending: () => pendingWrites++ }, onBusy: () => {}, disabled: false, active: true, onSelect: () => {} };
function buttons(node, list = []) {
  if (!node || typeof node !== 'object') return list;
  if (node.type === 'button') list.push(node);
  const children = node.props?.children;
  for (const child of Array.isArray(children) ? children : [children]) buttons(child, list);
  return list;
}
reply = () => { const { options } = calls.at(-1); authModule.guardOrigin(new Request('http://127.0.0.1:3100/admin/ai/image', { method: 'POST', headers: { ...options.headers, origin: 'http://127.0.0.1:3100' }, body: options.body })); return Response.json({ image: generated }); };
await buttons(component(props)).find(b => b.props.children === '이미지 1장 생성').props.onClick();
assert.equal(previewState?.name, generated.name); assert.equal(JSON.parse(calls.at(-1).options.body).body, 'Verified article facts'); assert.equal(pendingWrites, 0);
hook = 0;
buttons(component(props)).find(b => b.props.children === '선택하기').props.onClick();
assert.equal(pendingWrites, 1); assert.ok(previewState);
hook = 0;
await buttons(component(props)).find(b => b.props.children === '다시 생성').props.onClick();
assert.equal(pendingWrites, 1); assert.ok(previewState);
console.log('Image validation, authenticated routes and generation limits passed. Fixtures only.');

// Browser compression contract: resize, reduce bytes, preserve GIF and reject huge pixels.
let dimensions = [4000, 2000], drawn = [];
class FixtureImage { naturalWidth = dimensions[0]; naturalHeight = dimensions[1]; async decode() {} }
class FixtureReader { async readAsDataURL(blob) { this.result = `data:${blob.type};base64,${Buffer.from(await blob.arrayBuffer()).toString("base64")}`; this.onload(); } }
const canvas = { width: 0, height: 0, getContext: () => ({ drawImage: (_image, _x, _y, w, h) => drawn.push([w, h]) }), toBlob(callback, type, quality) { callback(new Blob([new Uint8Array(Math.ceil(this.width * this.height * quality))], { type })); } };
const compressor = load('lib/admin/image-client.ts', {}, { Image: FixtureImage, FileReader: FixtureReader, document: { createElement: () => canvas } });
const cover = await compressor.optimizeCover('data:image/jpeg;base64,fixture', 'photo.jpg');
assert.match(cover.name, /\.webp$/); assert.match(cover.dataUrl, /^data:image\/webp;base64,/); assert.ok(cover.bytes <= 400 * 1024); assert.ok(cover.width <= 1600); assert.ok(Math.abs(cover.width / cover.height - 2) < 0.01);
const gif = 'data:image/gif;base64,R0lGODlh'; const count = drawn.length;
assert.equal((await compressor.optimizeCover(gif, 'moving.gif')).dataUrl, gif); assert.equal(drawn.length, count);
dimensions = [30000, 30000]; await assert.rejects(compressor.optimizeCover('data:image/png;base64,fixture', 'large.png'), /너무 큽니다/);
console.log('Cover resizing/compression, aspect ratio and GIF preservation passed. Browser fixtures only.');

// Deletion validates all revisions/types before one transaction; fixtures never touch Sanity.
const deletionLog = [], invalidations = [];
let deletionDocs = [
  { _id: 'published', _type: 'journalPost', _rev: 'p1' },
  { _id: 'drafts.published', _type: 'journalPost', _rev: 'd1' },
  null,
  { _id: 'drafts.draft-only', _type: 'journalPost', _rev: 'd2' },
];
env.SANITY_API_WRITE_TOKEN = 'synthetic-fixture';
const deleteServer = load('lib/admin/sanity-server.ts', {
  'next-sanity': { createClient: () => ({
    getDocuments: async () => deletionDocs,
    transaction: () => {
      const tx = { patch(id, callback) { const patch = { ifRevisionId(rev) { deletionLog.push(['revision', id, rev]); return this; }, set() { return this; } }; callback(patch); return tx; }, delete(id) { deletionLog.push(['delete', id]); return tx; }, async commit() { deletionLog.push(['commit']); } }; return tx;
    },
  }) },
  'next/cache': { revalidatePath: (...args) => invalidations.push(args) },
  './schema.json': { default: JSON.parse(readFileSync('lib/admin/schema.json', 'utf8')) },
  './auth': { AuthError: class extends Error {}, guardOrigin() {}, requireSession: async () => ({ email: 'fixture' }) },
});
const targets = [{ id: 'published', publishedRev: 'p1', draftRev: 'd1' }, { id: 'draft-only', draftRev: 'd2' }];
await assert.rejects(deleteServer.deletePosts([{ ...targets[0], draftRev: 'stale' }, targets[1]]), /변경/);
assert.equal(deletionLog.length, 0);
const oldDocs = deletionDocs; deletionDocs = [...oldDocs]; deletionDocs[3] = { ...oldDocs[3], _type: 'noticePost' };
await assert.rejects(deleteServer.deletePosts(targets), /저널/); assert.equal(deletionLog.length, 0);
deletionDocs = oldDocs;
await assert.rejects(deleteServer.deletePosts([{ id: 'local.new' }]), /ID/);
await assert.rejects(deleteServer.deletePosts([targets[0], targets[0]]), /중복/);
assert.deepEqual(Array.from(await deleteServer.deletePosts(targets)), ['published', 'draft-only']);
assert.deepEqual(deletionLog.filter(entry => entry[0] === 'delete').map(entry => entry[1]), ['published', 'drafts.published', 'drafts.draft-only']);
assert.equal(deletionLog.filter(entry => entry[0] === 'commit').length, 1);
assert.deepEqual(invalidations, [['/', 'layout']]);
let routeDeleteCalls = 0, routeGuardCalls = 0;
const deleteRoute = load('app/admin/content/route.ts', { '@/lib/admin/sanity-server': {
  guard: async (_request, write) => { assert.equal(write, true); routeGuardCalls++; },
  deletePosts: async input => { assert.equal(JSON.stringify(input), JSON.stringify(targets)); routeDeleteCalls++; return ['published', 'draft-only']; },
  readSource: async () => ({ documents: [], states: {}, assets: [] }),
  failure: error => Response.json({ error: error.message }, { status: 400 }),
} });
assert.equal((await deleteRoute.DELETE(new Request('http://localhost/admin/content', { method: 'DELETE', body: JSON.stringify({ targets }) }))).status, 200);
assert.equal(routeDeleteCalls, 1); assert.equal(routeGuardCalls, 1);
assert.equal((await deleteRoute.DELETE(new Request('http://localhost/admin/content', { method: 'DELETE', body: 'bad-json' }))).status, 400);
assert.equal(routeDeleteCalls, 1);
console.log('Bulk deletion authentication, revision/type guards, draft/published pairing, atomic transaction and route validation passed. Fixtures only.');
