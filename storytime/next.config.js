/** @type {import('next').NextConfig} */
const nextConfig = {
  generateEtags: false,
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
