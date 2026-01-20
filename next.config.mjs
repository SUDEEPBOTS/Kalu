/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'c.saavncdn.com',
      },
      {
        protocol: 'https',
        hostname: 'aac.saavncdn.com',
      },
    ],
  },
};

export default nextConfig;
