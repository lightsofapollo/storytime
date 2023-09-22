/** @type {import('next').NextConfig} */
const nextConfig = {
  // disable odd behaviors such as doubler render, double useEffect, etc.
  reactStrictMode: false,
  generateEtags: false,
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
