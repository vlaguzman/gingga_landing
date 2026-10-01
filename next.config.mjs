/** @type {import("next").NextConfig} */
const nextConfig = {
  // Hostinger runs an old glibc: native SWC and sharp cannot load there.
  images: { unoptimized: true },
};

export default nextConfig;
