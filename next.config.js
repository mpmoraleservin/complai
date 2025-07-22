/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@pinecone-database/pinecone'],
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  output: 'standalone',
}

module.exports = nextConfig 