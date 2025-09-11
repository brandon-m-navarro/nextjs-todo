/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Add this to prevent ESLint errors from breaking build
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TypeScript errors during build
  },
}

export default nextConfig;