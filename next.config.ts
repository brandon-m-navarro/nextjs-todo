/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add experimental configuration
  experimental: {
    clientReferenceManifest: false, // Try disabling this
  },
  // Ensure proper output
  output: 'standalone', // or 'export' if you're doing static export
  // Clean up build artifacts
  cleanDistDir: true,
  // Disable telemetry
  telemetry: false,
}

module.exports = nextConfig