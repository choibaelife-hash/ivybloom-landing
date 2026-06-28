import React, { useEffect, useState } from 'react'
import { definePlugin, useClient } from 'sanity'

type PostAudit = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  metaTitle?: string
  metaDescription?: string
  ogImage?: { asset: unknown }
  mainImage?: { asset: unknown }
  excerpt?: string
  focusKeyphrase?: string
}

type CheckResult = 'pass' | 'warn' | 'fail'

const CHECKS: { key: keyof PostAudit; label: string }[] = [
  { key: 'metaTitle',       label: 'Meta Title' },
  { key: 'metaDescription', label: 'Meta Desc' },
  { key: 'ogImage',         label: 'OG Image' },
  { key: 'mainImage',       label: 'Main Image' },
  { key: 'excerpt',         label: 'Excerpt' },
  { key: 'focusKeyphrase',  label: 'Keyphrase' },
]

function checkField(post: PostAudit, key: keyof PostAudit): CheckResult {
  const val = post[key]
  if (!val) return 'fail'
  if (key === 'metaTitle'       && typeof val === 'string' && val.length > 60)  return 'warn'
  if (key === 'metaDescription' && typeof val === 'string' && val.length > 160) return 'warn'
  return 'pass'
}

function Badge({ result }: { result: CheckResult }) {
  const map = { pass: '✅', warn: '⚠️', fail: '❌' }
  return <span style={{ fontSize: 15 }}>{map[result]}</span>
}

function ScoreChip({ score, total }: { score: number; total: number }) {
  const color = score === total ? '#16a34a' : score >= total * 0.6 ? '#d97706' : '#dc2626'
  return (
    <span style={{ fontWeight: 700, color, fontSize: 13 }}>
      {score}/{total}
    </span>
  )
}

function SeoAuditTool() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [posts, setPosts] = useState<PostAudit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .fetch<PostAudit[]>(`
        *[_type == "post"] | order(publishedAt desc) {
          _id, title, slug, publishedAt,
          metaTitle, metaDescription,
          "ogImage":   defined(ogImage.asset),
          "mainImage": defined(mainImage.asset),
          excerpt, focusKeyphrase
        }
      `)
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [client])

  const totalChecks = CHECKS.length

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'system-ui, sans-serif', maxWidth: 1000 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>SEO Audit</h1>
      <p style={{ color: '#666', fontSize: 13, marginBottom: 28 }}>
        ✅ 통과 &nbsp;·&nbsp; ⚠️ 권장 범위 초과 &nbsp;·&nbsp; ❌ 누락
      </p>

      {loading ? (
        <p style={{ color: '#999' }}>불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p style={{ color: '#999' }}>포스트가 없습니다.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8f8f8', borderBottom: '2px solid #e5e5e5' }}>
              <th style={th}>제목</th>
              <th style={{ ...th, textAlign: 'center' }}>점수</th>
              {CHECKS.map((c) => (
                <th key={c.key} style={{ ...th, textAlign: 'center' }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              const results = CHECKS.map((c) => checkField(post, c.key))
              const score = results.filter((r) => r === 'pass').length
              return (
                <tr key={post._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={td}>
                    <span style={{ fontWeight: 500 }}>{post.title}</span>
                    <span style={{ display: 'block', color: '#aaa', fontSize: 11, marginTop: 2 }}>
                      {new Date(post.publishedAt).toLocaleDateString('ko-KR')}
                    </span>
                  </td>
                  <td style={{ ...td, textAlign: 'center' }}>
                    <ScoreChip score={score} total={totalChecks} />
                  </td>
                  {results.map((r, i) => (
                    <td key={i} style={{ ...td, textAlign: 'center' }}>
                      <Badge result={r} />
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: 28, padding: '16px 20px', background: '#f8f8f8', borderRadius: 6, fontSize: 12, color: '#666', lineHeight: 1.7 }}>
        <strong style={{ color: '#333' }}>점검 기준</strong><br />
        Meta Title: 60자 이내 권장 / Meta Description: 160자 이내 권장 / OG Image, Main Image, Excerpt, Keyphrase: 입력 여부
      </div>
    </div>
  )
}

const th: React.CSSProperties = {
  padding: '10px 14px',
  fontWeight: 600,
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#666',
  textAlign: 'left',
}

const td: React.CSSProperties = {
  padding: '12px 14px',
  verticalAlign: 'middle',
}

export const seoAuditPlugin = definePlugin({
  name: 'seo-audit',
  tools: [
    {
      name: 'seo-audit',
      title: 'SEO Audit',
      component: SeoAuditTool,
    },
  ],
})
