/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com', 'i.ytimg.com', 'vumbnail.com', 'img.youtube.com'],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig