// Exercise the real backup functions against a transactional in-memory IndexedDB fixture.
// No browser data, credentials, network requests or Sanity writes.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const rows = new Map();
const indexedDB = { open() {
  const request = {};
  queueMicrotask(() => {
    request.result = { close() {}, transaction() {
      let aborted = false;
      const tx = { abort() { aborted = true; queueMicrotask(() => tx.onabort?.()); }, objectStore() {
        return {
          get(id) { const read = {}; queueMicrotask(() => {
            read.result = rows.get(id); read.onsuccess?.();
            if (!aborted) queueMicrotask(() => tx.oncomplete?.());
          }); return read; },
          put(copy) { rows.set(copy.id, copy); }, delete(id) { rows.delete(id); },
        };
      } }; return tx;
    } }; request.onsuccess?.();
  }); return request;
} };
const exports = {};
const imageExports = {};
const imageCode = ts.transpileModule(readFileSync("lib/local-images.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
vm.runInNewContext(imageCode, { exports: imageExports, URL });
const code = ts.transpileModule(readFileSync("lib/local-studio.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
vm.runInNewContext(code, { exports, indexedDB, require(name) {
  if (name === "./local-images") return imageExports;
  if (name === "./admin/schema.json") return JSON.parse(readFileSync("lib/admin/schema.json", "utf8"));
  if (name === "@sanity/image-url") return {};
  throw Error(name);
} });
const copy = revision => ({ id: "fixture", revision, document: { _id: "fixture" }, pendingMedia: {} });
await exports.saveCopy(copy("one"));
await assert.rejects(exports.saveCopy(copy("conflict")), /다른 탭/);
await exports.saveCopy(copy("two"), "one");
await assert.rejects(exports.removeCopy("fixture", "one"), /다른 탭/);
assert.equal(rows.get("fixture").revision, "two");
await exports.removeCopy("fixture", "two");
assert.equal(rows.has("fixture"), false);
await exports.saveCopy(copy("after-save"));
assert.equal(rows.get("fixture").revision, "after-save");
console.log("Backup create/update/delete revision guards and editing after save passed. In-memory fixture only.");
