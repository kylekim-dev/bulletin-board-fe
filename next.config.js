/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PUBLIC_API_URL:'http://localhost:1337',
  }
}

module.exports = nextConfig
