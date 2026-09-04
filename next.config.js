/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com', 'cdn.shopify.com', 'content.jdmagicbox.com', 'www.svgrepo.com'],
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true }
}
module.exports = nextConfig
