// Exercise the shared analysis functions without network calls or content writes.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(path) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports, require(name) { if (name === "./schema.json") return JSON.parse(readFileSync("lib/admin/schema.json", "utf8")); throw Error(name); } });
  return exports;
}
const { analyzeBody } = load('lib/admin/body-analysis.ts');
const { CHECKS, checkField, checkMessage } = load('lib/admin/seo-audit.ts');
const block = (text, style = 'normal') => ({ _key: text.slice(0, 8), _type: 'block', style, children: [{ _type: 'span', text, marks: [] }] });
const post = { _id: 'sample', _type: 'journalPost', category: 'college', publishedAt: '2026-10-04T00:00:00Z', title: 'A brief class update', slug: { current: 'class-update' }, excerpt: 'Students practised discussion.', mainImage: { _type: 'image', asset: { _type: 'reference', _ref: 'image-fixture' } }, body: [block('Students practised discussion.')], focusKeyphrase: 'different exact phrase' };
const result = (data, key) => checkField(data, CHECKS.find(c => c.key === key));
assert.equal(result(post, 'metaTitle'), 'pass');
assert.equal(result(post, 'metaDescription'), 'pass');
assert.equal(result(post, 'ogImage'), 'pass');
assert.match(checkMessage(post, CHECKS.find(c => c.key === 'metaTitle')), /기본값/);
assert.equal(result({ ...post, metaTitle: ' '.repeat(4) }, 'metaTitle'), 'pass');
assert.equal(result({ ...post, mainImage: {}, ogImage: { asset: { _ref: 'image-123' } } }, 'ogImage'), 'pass');
assert.equal(result({ ...post, mainImage: 'blob:pending' }, 'ogImage'), 'warn');
assert.equal(result(post, 'keyword'), 'info');
assert.equal(result({ ...post, title: '' }, 'title'), 'fail');
assert.equal(result({ ...post, slug: { current: 'invalid address' } }, 'slug'), 'fail');
assert.equal(result({ ...post, slug: { current: ' class-update ' } }, 'slug'), 'fail');
assert.equal(result({ ...post, slug: { current: '한국어-주소' } }, 'slug'), 'pass');
assert.equal(result(post, 'category'), 'pass');
assert.equal(result({ ...post, category: '' }, 'category'), 'fail');
assert.equal(result({ ...post, category: 'unrecognised' }, 'category'), 'fail');
assert.equal(result({ ...post, category: 'other' }, 'category'), 'pass');
assert.equal(result(post, 'publishedAt'), 'pass');
assert.equal(result({ ...post, publishedAt: '' }, 'publishedAt'), 'fail');
assert.equal(result({ ...post, publishedAt: 'invalid-date' }, 'publishedAt'), 'fail');
assert.equal(result({ ...post, body: [...post.body, { _type: 'checklistBlock', items: [] }] }, 'blocks'), 'fail');
assert.equal(result({ ...post, body: [...post.body, { _type: 'tableBlock', rows: [{ phase: 'Week 1' }] }] }, 'blocks'), 'pass');
assert.equal(result({ ...post, body: [block('   ')] }, 'body'), 'fail');
assert.equal(result({ ...post, pendingUploads: 1 }, 'uploads'), 'fail');
// Upload completion must immediately clear both image checks in the returned editor snapshot.
const uploadedPost = { ...post, mainImage: 'https://cdn.sanity.io/images/project/dataset/saved.webp', ogImage: undefined, pendingUploads: 0 };
assert.equal(result(uploadedPost, 'uploads'), 'pass');
assert.equal(result(uploadedPost, 'ogImage'), 'pass');
assert.equal(result({ ...post, body: [...post.body, { _type: 'image' }] }, 'uploads'), 'fail');
assert.equal(result({ ...post, faqSection: [{ question: 'Who?', answer: '' }] }, 'faq'), 'fail');
assert.equal(result({ ...post, faqSection: [] }, 'faq'), 'pass');
for (const blocks of [[block('Short answer.')], [block('word '.repeat(3000))], [block('FAQ: an example'), block('No keyword at the end.')]]) {
  assert.equal(analyzeBody(blocks, 'missing keyword').some(c => c.status === 'fail'), false);
}
const structure = analyzeBody([block('Heading', 'h3'), block('Large title', 'h1'), block('Answer')], '');
assert.equal(structure.filter(c => c.group === 'recommended' && c.status === 'warn').length, 2);
assert.equal(structure.some(c => c.status === 'fail'), false);
const keyword = analyzeBody([block('Read read read.')], 'read').find(c => c.key === '핵심 검색 키워드');
assert.equal(keyword.status, 'info');
assert.match(keyword.message, /3회/);
const images = analyzeBody([...post.body, { _type: 'image', _key: 'img', asset: { _ref: 'image-123' } }], '');
assert.equal(images.find(c => c.key === '이미지 설명').group, 'recommended');
assert.equal(images.some(c => c.status === 'fail'), false);
assert.equal(analyzeBody([], '').some(c => c.key === '본문' && c.status === 'fail'), true);
const longBody = analyzeBody([block('word '.repeat(1000))], 'missing');
assert.equal(longBody.find(c => c.key === '문단 읽기').group, 'recommended');
assert.equal(longBody.find(c => c.key === '소제목으로 나누기').group, 'recommended');
assert.equal(analyzeBody([block('Topic', 'h2'), block('word '.repeat(1000))], '').find(c => c.key === '소제목으로 나누기').status, 'pass');
assert.equal(analyzeBody([block('Short article.')], '').some(c => c.status === 'fail' || (c.group === 'recommended' && c.status === 'warn')), false);
console.log('Admin SEO fallback, required-field, upload, FAQ, keyword and editorial guidance checks passed. No network or writes.');

assert.equal(result({ ...post, noindex: true }, 'indexing'), 'info');
assert.match(checkMessage({ ...post, noindex: true }, CHECKS.find(c => c.key === 'indexing')), /사이트맵에서도 제외/);
