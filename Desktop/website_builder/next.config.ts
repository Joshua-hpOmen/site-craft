import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'uploadthing.com',
      'utfs.io',
      'img.clerk.com',
      'subdomain',
      'files.stripe.com',
      'https://utfs.io'
    ]
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
