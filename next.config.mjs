/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  serverExternalPackages: [
    "pdf-parse",
    "@napi-rs/canvas",
  ],
};

export default nextConfig;