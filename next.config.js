/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    //PUBLIC_API_URL:'http://newwavecoreapi-dev.us-west-2.elasticbeanstalk.com',
    PUBLIC_API_URL:'https://devpartnercoreapi.newwavelending.com',
    //PUBLIC_API_URL:'https://localhost:44344',
  }
}

module.exports = nextConfig
