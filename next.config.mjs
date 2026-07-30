/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  eslint: {
    // Lint is run explicitly via `npm run lint`; do not block production builds.
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
