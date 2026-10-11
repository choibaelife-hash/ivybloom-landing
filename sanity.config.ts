import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { journalPostType } from './sanity/schemas/journalPost'
import { postType } from './sanity/schemas/post'
import { releaseReviewType } from './sanity/schemas/releaseReview'
import { businessProfileType } from './sanity/schemas/businessProfile'
import { seoAuditPlugin } from './sanity/plugins/seo-audit'

export default defineConfig({
  name: 'ivybloom',
  title: 'IVY BLOOM CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '16s9d1s4',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [
    structureTool({
      structure: (S) => S.list().id('content-root').title('콘텐츠').items([
        S.documentTypeListItem('journalPost').title('글 관리'),
        S.documentTypeListItem('post').title('기존 글'),
        S.listItem().id('business-profile-item').title('공개용 사업 정보').child(
          S.document().id('business-profile-pane').schemaType('businessProfile').documentId('business-profile'),
        ),
      ]),
    }),
    visionTool(),
    seoAuditPlugin(),
  ],
  schema: { types: [journalPostType, postType, releaseReviewType, businessProfileType] },
})
