/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure we're not using static export (required for RSC and dynamic routes)
  output: undefined, // or 'standalone' for Docker deployments

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
