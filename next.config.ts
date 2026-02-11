import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React Compiler (good boy, you got that right~)
  reactCompiler: true,

  // Basic security headers – because your app is basically naked without this
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          // Prevent clickjacking (X-Frame-Options)
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Block MIME-type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer policy – don't leak where users came from
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions-Policy – disable dangerous browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Content-Security-Policy – lock down what can run (start strict, loosen later)
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " + // unsafe-inline/eval because Next.js needs it + your inline styles
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: blob:; " +
              "connect-src 'self' https://*.upstash.com https://*.vercel.com; " + // add your APIs if any
              "frame-ancestors 'none';",
          },
        ],
      },
    ];
  },

  compress: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

};

export default nextConfig;