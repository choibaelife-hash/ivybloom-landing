// AI contract/security regression checks. No credentials, API calls or Sanity writes.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import crypto from "node:crypto";
import ts from "typescript";
function load(file, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports, crypto, process: { env: {} }, ...globals, require(name) { if (name === "server-only") return {}; throw Error(name); } });
  return exports;
}
const api = load("lib/admin/ai-writing.ts"), draft = load("lib/admin/ai-draft.ts");
const approved = { action: "generate", keyword: "영어 독서", notes: "매주 읽고 토론합니다.", title: "English Reading Classes", summary: "Students read and discuss English passages each week.", focusKeyphrase: "English reading classes", slug: "english-reading-classes" };
assert.equal(api.validateInput(approved).notes, approved.notes);
assert.throws(() => api.validateInput({ ...approved, title: "한국어 제목" }), /영어/);
assert.throws(() => api.validateInput({ ...approved, slug: "Bad Slug" }), /글 주소/);
assert.throws(() => api.validateInput({ ...approved, notes: "x".repeat(12001) }));
assert.throws(() => api.validatePreparation({ focusKeyphrase: "reading", titles: [], warnings: [] }));
const result = { blocks: [{ style: "normal", text: "Students read English passages each week.", list: "none" }, { style: "h2", text: "What Do Students Practice?", list: "none" }, { style: "normal", text: "Students summarize the passage and discuss their opinions.", list: "none" }], metaTitle: "English Reading Classes", metaDescription: "Students read English passages and share their own opinions in weekly classes.", keywords: ["English reading"], twitterTitle: "English Reading Classes", twitterDescription: "Weekly reading and discussion.", faqSection: [{ question: "What do students read?", answer: "They read English passages." }], warnings: [] };
api.validateWriting(result);
assert.throws(() => api.validateWriting({ ...result, metaDescription: "x".repeat(161) }));
assert.throws(() => api.validateWriting({ ...result, faqSection: [{ question: "질문?", answer: "답변" }] }));
assert.throws(() => api.validateWriting({ ...result, metaTitle: "English Reading to提升" }));
const patch = draft.writingPatch(result), baseline = { _id: "post", _type: "journalPost", mainImage: "existing-image", slug: { current: "published-address" }, metaTitle: "Human title", body: [] };
const seoOnly = draft.applyDraft(baseline, baseline, patch, ["seo"]);
assert.equal(seoOnly.mainImage, baseline.mainImage);
assert.equal(seoOnly.slug.current, "published-address");
assert.equal(seoOnly.body.length, 0);
assert.throws(() => draft.applyDraft({ ...baseline, metaTitle: "Edited during generation" }, baseline, patch, ["seo"]), /보호/);
assert.throws(() => draft.applyDraft({ ...baseline, _id: "another" }, baseline, patch, ["content"]), /보호/);
assert.equal(draft.applyDraft({ ...baseline, mainImage: "new-photo" }, baseline, patch, ["content"]).mainImage, "new-photo");
assert.equal(patch.body[1].style, "h2");
assert.equal(patch.body[0].children[0].text, result.blocks[0].text);
assert.equal(new Set(patch.body.map(b => b._key)).size, 3);
const listPatch = draft.writingPatch({ ...result, blocks: [{ style: "normal", text: "- Read a passage\n- Discuss opinions", list: "bullet" }] });
assert.equal(listPatch.body.length, 2);
assert.equal(listPatch.body[0].children[0].text, "Read a passage");
assert.equal(listPatch.body[1].listItem, "bullet");
// Existing embedded content must survive AI-assisted metadata/Q&A edits.
for (const block of [
  { _type: "image", _key: "photo", asset: { _ref: "image-existing" }, alt: "Class photo" },
  { _type: "tableBlock", _key: "table", rows: [{ phase: "Week 1", focus: "Reading", goal: "Discuss" }] },
  { _type: "checklistBlock", _key: "list", items: ["Read"] },
  { _type: "customBlock", _key: "future" },
]) {
  const current = { ...baseline, body: [patch.body[0], block] };
  const before = JSON.stringify(current);
  assert.equal(draft.hasProtectedBody(current), true);
  assert.throws(() => draft.applyDraft(current, current, patch, ["content", "seo"]), /교체할 수 없습니다/);
  assert.equal(JSON.stringify(current), before);
  const applied = draft.applyDraft(current, current, patch, ["seo", "aeo"]);
  assert.equal(JSON.stringify(applied.body), JSON.stringify(current.body));
  assert.equal(applied.mainImage, current.mainImage);
  assert.equal(applied.metaTitle, result.metaTitle);
  assert.match(draft.previewBody(current), /\[/);
}
assert.match(draft.previewBody({ body: [{ _type: "image", alt: "Class photo" }] }), /Class photo/);
assert.equal(draft.hasProtectedBody({ body: patch.body }), false);
assert.equal(draft.applyDraft(baseline, baseline, patch, ["content"]).body, patch.body);
console.log("AI input/output validation, selective apply, stale response protection and Portable Text checks passed. No network or writes.");

// Rich text remains structured and preserves the exact article text.
const styled = { ...result, blocks: [
  { style: "normal", text: "The score rose by 110 points.", list: "none", emphasis: ["110 points"] },
  { style: "h2", text: "What Changed?", list: "none", emphasis: [] },
  { style: "blockquote", text: "The student returned ready to work.", list: "none", emphasis: [] },
] };
api.validateWriting(styled);
const styledPatch = draft.writingPatch(styled);
assert.equal(styledPatch.body[0].children.map(span => span.text).join(""), styled.blocks[0].text);
assert.equal(styledPatch.body[0].children.find(span => span.marks.includes("strong")).text, "110 points");
assert.equal(styledPatch.body[2].style, "blockquote");
const invalidHighlight = api.validateWriting({ ...styled, blocks: [{ ...styled.blocks[0], emphasis: ["invented", " 110 points ", ""] }, ...styled.blocks.slice(1)] });
assert.deepEqual(invalidHighlight.blocks[0].emphasis, ["110 points"]);
assert.equal(invalidHighlight.blocks[0].text, styled.blocks[0].text);
assert.throws(() => api.validateWriting({ ...styled, blocks: [{ ...styled.blocks[0], emphasis: [42] }, ...styled.blocks.slice(1)] }), /강조/);
assert.throws(() => api.validateWriting({ ...styled, blocks: [...styled.blocks.slice(0, 2), { ...styled.blocks[2], list: "bullet" }] }), /문단/);
const liveContract = load("lib/admin/ai-writing.ts", { process: { env: { OPENAI_API_KEY: "fixture-key" } }, AbortSignal, fetch: async () => ({ ok: true, json: async () => ({ status: "completed", output: [{ content: [{ type: "output_text", text: JSON.stringify(styled) }] }] }) }) });
await assert.rejects(liveContract.generateWriting(approved), /인용문/);
assert.equal((await liveContract.generateWriting({ ...approved, notes: styled.blocks[2].text })).blocks[2].style, "blockquote");
console.log("AI structured emphasis, quote formatting and source-verified quotations passed. Fixtures only.");

const titleCandidate = { title: "New recommended title", slug: "new-title", summary: "New summary" };
const titleSelected = draft.applyTitleChoice(baseline, "English reading", titleCandidate);
assert.equal(titleSelected.title, titleCandidate.title);
assert.equal(titleSelected.focusKeyphrase, "English reading");
assert.equal(titleSelected.excerpt, titleCandidate.summary);
assert.equal(titleSelected.slug.current, "published-address");
const newTitleSelected = draft.applyTitleChoice({ ...baseline, _id: "local.sample", slug: undefined }, "English reading", titleCandidate);
assert.equal(newTitleSelected.slug.current, "new-title");
assert.equal(draft.applyTitleChoice({ ...baseline, _id: "local.sample" }, "English reading", titleCandidate).slug.current, "published-address");
assert.equal(draft.applyTitleChoice(newTitleSelected, "English reading", { ...titleCandidate, slug: "second-title" }, "new-title").slug.current, "second-title");

const numericParagraph = api.validateWriting({ ...styled, blocks: [{ ...styled.blocks[0], text: "760", emphasis: [] }, ...styled.blocks.slice(1)] });
assert.equal(numericParagraph.blocks[0].text, "760");
assert.throws(() => api.validateWriting({ ...styled, metaDescription: "x".repeat(161) }), /검색 설명.*160/);
assert.throws(() => api.validateWriting({ ...styled, blocks: [{ ...styled.blocks[0], text: "한국어 내용" }, ...styled.blocks.slice(1)] }), /본문 문단.*영어 이외/);

// Body rewrites must not generate or validate unrelated search/share fields.
const bodyResponse = { blocks: result.blocks, warnings: [] };
let rewriteRequest;
const rewriteContract = load("lib/admin/ai-writing.ts", {
  process: { env: { OPENAI_API_KEY: "fixture-key" } }, AbortSignal,
  fetch: async (_url, options) => {
    rewriteRequest = JSON.parse(options.body);
    return { ok: true, json: async () => ({ status: "completed", output: [{ content: [{ type: "output_text", text: JSON.stringify(bodyResponse) }] }] }) };
  },
});
const rewriteInput = rewriteContract.validateInput({ ...approved, scope: "content" });
const rewritten = await rewriteContract.generateWriting(rewriteInput);
assert.deepEqual(Object.keys(rewritten).sort(), ["blocks", "warnings"]);
assert.deepEqual(Object.keys(rewriteRequest.text.format.schema.properties).sort(), ["blocks", "warnings"]);
const rewritePatch = draft.writingPatch(rewritten);
assert.deepEqual(Object.keys(rewritePatch), ["body"]);
const existing = { ...baseline, body: patch.body, metaTitle: "Existing search title", faqSection: patch.faqSection };
const rewrittenDocument = draft.applyDraft(existing, existing, rewritePatch, ["content"]);
assert.equal(rewrittenDocument.metaTitle, existing.metaTitle);
assert.equal(rewrittenDocument.faqSection, existing.faqSection);
assert.throws(() => rewriteContract.validateInput({ ...approved, scope: "anything" }), /범위/);
console.log("Body-only rewrite schema and preservation of SEO/FAQ passed. Mock API only.");

// Restoring the previous body preserves other fields and protects later manual edits.
const rollbackBaseline = { ...existing, body: rewritePatch.body };
const rolledBack = draft.applyDraft(rewrittenDocument, rollbackBaseline, { body: existing.body }, ["content"]);
assert.equal(rolledBack.body, existing.body);
assert.equal(rolledBack.metaTitle, existing.metaTitle);
assert.throws(() => draft.applyDraft({ ...rewrittenDocument, body: [] }, rollbackBaseline, { body: existing.body }, ["content"]), /보호/);
console.log("Previous-body restore and later-edit protection passed.");

assert.ok(!("twitterTitle" in api.validateWriting(result)));
assert.ok(!("twitterDescription" in patch));
console.log("AI drafts omit X-specific fields.");
