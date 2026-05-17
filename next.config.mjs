/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  allowedDevOrigins: [
    "10.15.36.85",
  ],
};

export default nextConfig;
