/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/blog', destination: '/articles', permanent: true },
      { source: '/blog/:slug', destination: '/articles/:slug', permanent: true },
    ]
  },
  async headers() {
    return [{ source: '/:section(admin|studio)/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]
  },
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'cdn.sanity.io' },
    ],
  },
}
export default nextConfig
