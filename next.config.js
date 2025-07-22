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
  experimental: {
    // Disable static generation for pages that depend on authentication
    workerThreads: false,
    cpus: 1
  }
}

module.exports = nextConfig 