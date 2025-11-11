/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: import.meta.dirname, // sets correct root directory
  },
  experimental: {
    turbo: false, // optional: disables Turbopack if it keeps crashing
  },
};

export default nextConfig;
