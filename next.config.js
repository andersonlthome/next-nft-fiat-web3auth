/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["gateway.ipfscdn.io"],
  },
}

module.exports = nextConfig
