import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { postType } from './sanity/schemas/post'
import { seoAuditPlugin } from './sanity/plugins/seo-audit'

export default defineConfig({
  name: 'ivybloom',
  title: 'IVY BLOOM CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'fxgjdpno',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [structureTool(), visionTool(), seoAuditPlugin()],
  schema: { types: [postType] },
})
