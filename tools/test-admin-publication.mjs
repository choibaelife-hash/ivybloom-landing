import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Execute the editor's real save function and actual primary-button handler.
const text = readFileSync('components/admin/LocalStudio.tsx', 'utf8');
const ast = ts.createSourceFile('editor.tsx', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let saveNode, handler;
function visit(node) {
  if (ts.isFunctionDeclaration(node) && node.name?.text === 'save') saveNode = node;
  if (ts.isJsxAttribute(node) && node.name.text === 'onClick' && node.initializer?.getText(ast).includes('save(isPublished)')) handler = node.initializer.expression;
  ts.forEachChild(node, visit);
}
visit(ast);
assert.ok(saveNode && handler);
assert.ok(text.includes('{!isPublished && <HelpTip text="현재'));
assert.ok(!text.includes('"변경 반영"'));
const code = ts.transpileModule(`${saveNode.getText(ast)}\nexports.run = ${handler.getText(ast)};`, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
async function scenario({ published, failPublish = false }) {
  const calls = [], messages = [], errors = [], uploads = [];
  const editor = { _id: 'sample', _type: 'journalPost', title: 'Edited title', mainImage: { _type: 'image', alt: 'Selected image' } };
  let savedDocument;
  const noop = () => {};
  const context = {
    exports: {}, editor, isPublished: published, saving: false, aiBusy: false,
    sourceRev: 'original-revision', source: { states: { sample: published ? { publishedRev: 'published-revision' } : {} }, assets: [] },
    pending: { mainImage: { name: 'generated-cover-test.webp', dataUrl: 'data:image/webp;base64,AA==' } },
    structuredClone, FormData, Blob, Error, setSaving: noop, setError: e => errors.push(e), setMessage: m => messages.push(m),
    setEditor: noop, setSource: noop, setSourceRev: noop, setPending: noop, setSaved: noop,
    setCopies: noop, backupQueue: { current: Promise.resolve() }, backupRevision: { current: undefined }, removeCopy: async () => {},
    fetch: async (url, options) => {
      if (url.startsWith('data:')) return { blob: async () => new Blob(['test'], { type: 'image/webp' }) };
      assert.equal(url, '/admin/assets'); assert.equal(options.body.get('file').name, 'generated-cover-test.webp'); uploads.push(url);
      return { ok: true, json: async () => ({ asset: { _id: 'image-selected' } }) };
    },
    post: async (url, payload) => {
      calls.push(url);
      if (url === '/admin/content') {
        assert.equal(payload.expectedRevision, 'original-revision');
        assert.equal(payload.document.mainImage.asset._ref, 'image-selected');
        savedDocument = { ...payload.document, _rev: 'draft-revision' };
        return { document: savedDocument, source: {} };
      }
      assert.equal(url, '/admin/publish'); assert.equal(payload.revision, 'draft-revision');
      assert.equal(payload.publishedRevision, 'published-revision');
      if (failPublish) throw new Error('Publication unavailable');
      return { document: { ...savedDocument, _rev: 'new-published-revision' }, source: {} };
    },
  };
  vm.runInNewContext(code, context);
  // The UI handler uses void, so observe the real operation through a save wrapper.
  let task;
  const originalSave = context.save;
  context.save = (...args) => { task = originalSave(...args); return task; };
  context.exports.run(); await task;
  assert.equal(uploads.length, 1);
  assert.deepEqual(calls, published ? ['/admin/content', '/admin/publish'] : ['/admin/content']);
  if (failPublish) { assert.equal(errors.at(-1), 'Publication unavailable'); assert.ok(messages.at(-1).includes('발행이 완료되어야')); }
  else if (published) assert.ok(messages.at(-1).includes('홈페이지에 반영되었습니다'));
  else assert.ok(messages.at(-1).includes('임시저장했습니다'));
}
await scenario({ published: true });
await scenario({ published: false });
await scenario({ published: true, failPublish: true });
console.log('Published save uploads selected image and publishes in one click; new drafts remain private; publication failure retains saved draft and shows error.');
