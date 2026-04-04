
import type { NextConfig } from 'next';
import { validateEnv } from './src/lib/env-check';

// ✅ Validate environment variables at build time
if (process.env.NODE_ENV !== 'test') {
  validateEnv();
}

const nextConfig: NextConfig = {
  /* config options here */
  distDir: '.next-build', // Use different build directory to avoid trace file lock
  typescript: {
    ignoreBuildErrors: false, // ✅ Fail builds on TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: false, // ✅ Fail builds on ESLint errors
  },
  output: 'standalone', // ✅ For Docker deployment
  webpack: (config, { webpack }) => {
    // Ignore optional dependencies that Genkit doesn't require
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /@opentelemetry\/exporter-jaeger/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /@genkit-ai\/firebase/,
      })
    );

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // ✅ Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
