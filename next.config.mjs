/** @type {import("next").NextConfig} */
const nextConfig = {
  // Hostinger runs an old glibc: native SWC and sharp cannot load there.
  images: { unoptimized: true },
  // Next 16 blocks dev-only assets (HMR, hydration chunks) for any host except localhost.
  // Playbook uploads go through a Server Action; the default 1 MB body limit would reject files under
  // the 10 MB cap enforced in the action (12 MB leaves room for multipart overhead).
  experimental: { serverActions: { bodySizeLimit: "12mb" } },
  allowedDevOrigins: ["127.0.0.1", "192.168.0.*"],
};

export default nextConfig;
