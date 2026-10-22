import assert from 'node:assert/strict'
import test from 'node:test'
import { ARTICLE_CATEGORIES, articleCategory, articleCategoryLabel } from '../lib/editorial/categories'
import manifest from '../lib/admin/schema.json'
import { checkField, type CheckDef } from '../lib/admin/seo-audit'

test('legacy SAT and essay articles stay discoverable under college admissions without changing stored values', () => {
  const posts = [{ id: 'a', category: 'sat' }, { id: 'b', category: 'essay' }, { id: 'c', category: 'college' }, { id: 'd', category: 'boarding' }]
  const before = structuredClone(posts)
  const filtered = posts.filter((post) => articleCategory(post.category) === articleCategory('sat'))
  assert.deepEqual(filtered.map((post) => post.id), ['a', 'b', 'c'])
  assert.equal(articleCategoryLabel('essay'), 'College Admissions')
  assert.deepEqual(posts, before)
})

test('consultation has its own category and Other is no longer a filter but old Other posts keep their label', () => {
  assert.equal(articleCategory('consultation'), 'consultation')
  assert.equal(articleCategoryLabel('consultation'), 'Parent & Student Consultation')
  assert.deepEqual(ARTICLE_CATEGORIES.map((item) => item.value), ['story', 'college', 'boarding', 'consultation'])
  assert.equal(articleCategory('other'), undefined)
  assert.equal(articleCategoryLabel('other'), 'Other')
  assert.equal(articleCategory('retired-category'), undefined)
  assert.equal(articleCategory(undefined), undefined)
})

test('admin category choices match the public filter order', () => {
  const field = manifest.journalPost.fields.find((field) => field.name === 'category')!
  assert.deepEqual(field.options!.list!.map((item) => item.value), ARTICLE_CATEGORIES.map((item) => item.value))
})

test('admin audit preserves legacy categories while rejecting an unknown value', () => {
  const check: CheckDef = { key: 'category', label: '글 분류', group: 'required', field: 'category' }
  const post = { _id: 'legacy', title: 'Admissions guide', slug: { current: 'admissions-guide' } }
  for (const category of ['sat', 'essay', 'other', 'consultation']) {
    assert.equal(checkField({ ...post, category }, check), 'pass')
  }
  assert.equal(checkField({ ...post, category: 'unknown' }, check), 'fail')
  assert.equal(checkField(post, check), 'fail')
})
