/** @type {import("next").NextConfig} */
const nextConfig = {
  // Hostinger runs an old glibc: native SWC and sharp cannot load there.
  images: { unoptimized: true },
  // Next 16 blocks dev-only assets (HMR, hydration chunks) for any host except localhost.
  allowedDevOrigins: ["127.0.0.1", "192.168.0.*"],
};

export default nextConfig;
