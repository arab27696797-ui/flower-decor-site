// next.config.ts
// PRIMA Decor — Next.js production configuration.
//
// Replaces next.config.js. Filename changed to .ts per project convention.
// Delete next.config.js after this file is committed to avoid config conflicts.
//
// REMOTE IMAGE SOURCES:
//   images.unsplash.com  — temporary hero image in components/site/hero-section.tsx
//   picsum.photos        — carried forward from original next.config.js (fallback placeholders)
//
// SECURITY HEADERS:
//   Strict-Transport-Security  — enforces HTTPS
//   X-Content-Type-Options     — prevents MIME-type sniffing
//   X-Frame-Options            — clickjacking protection (allow same-origin for admin embeds)
//   X-XSS-Protection           — legacy XSS filter (belt-and-suspenders)
//   Referrer-Policy            — controls referrer leakage
//   Permissions-Policy         — disables unused browser APIs
//   Content-Security-Policy    — see inline note on CSP strategy
//
// CSP STRATEGY:
//   The CSP is intentionally permissive on first deployment so that
//   the Unsplash hero image, Google Fonts, and Zustand state (inline scripts)
//   all work without CSP violations breaking the site for real users.
//   Tighten it incrementally once the production domain is confirmed and
//   all external dependencies are audited.
//   Current allowlist:
//     - scripts: self + unsafe-inline (required by Next.js internal hydration)
//     - styles:  self + unsafe-inline + fonts.googleapis.com (Google Fonts CSS)
//     - fonts:   fonts.gstatic.com (Google Fonts binary)
//     - images:  self + data: + blob: + images.unsplash.com + picsum.photos
//     - connect: self (API routes)
//     - frame:   none (no iframes used)
//     - objects: none
//
// PRISMA NOTE:
//   Prisma does not require any special Next.js config for Railway PostgreSQL.
//   The DATABASE_URL env var is read at runtime by @prisma/client directly.
//   The build-time 'prisma generate' is handled via the Railway build command
//   or the railway.toml [build] section — not in next.config.ts.
//   serverExternalPackages is NOT needed for @prisma/client in Next.js 14+
//   (the App Router already handles it correctly).

import type { NextConfig } from 'next'

// ---------------------------------------------------------------------------
// Security headers applied to all routes
// ---------------------------------------------------------------------------

const securityHeaders = [
  // Force HTTPS for 1 year; include subdomains; allow preload list submission.
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  // Prevent browsers from guessing MIME types.
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Prevent this page from being embedded in an iframe on a different origin.
  // SAMEORIGIN allows the site to embed its own content (e.g., admin panel).
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // Legacy XSS auditor — kept for older browser compatibility.
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  // Limit referrer information sent to third-party origins.
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Disable browser APIs that this site does not use.
  {
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',        // site does NOT process payments
      'usb=()',
      'fullscreen=(self)', // allow fullscreen for potential future gallery
    ].join(', '),
  },
  // Content Security Policy — see strategy note above.
  // unsafe-inline in script-src is required by Next.js inline bootstrap scripts.
  // Tighten by adding a nonce-based approach once domain is stable.
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js requires 'unsafe-inline' for its inline hydration scripts.
      // 'unsafe-eval' is NOT included — no eval usage in this project.
      "script-src 'self' 'unsafe-inline'",
      // Inline styles are used by Tailwind CSS and Next.js SSR.
      // Google Fonts injects a CSS stylesheet from fonts.googleapis.com.
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com",
      // Google Fonts and Fontshare serve font binary files from these origins.
      "font-src 'self' https://fonts.gstatic.com https://api.fontshare.com",
      // Images: self + data URIs (SVG inline) + blob (canvas/object URLs) +
      //         Unsplash (hero) + Picsum (fallback placeholders).
      "img-src 'self' data: blob: https://images.unsplash.com https://picsum.photos",
      // API routes are same-origin. Telegram Bot API is called server-side
      // (via lib/telegram.ts in a Route Handler), so it does NOT need to be
      // in the browser-level connect-src.
      "connect-src 'self'",
      // No iframes used.
      "frame-src 'none'",
      // No Flash, Java, or other plugins.
      "object-src 'none'",
      // Restrict where forms can submit (same origin only).
      "form-action 'self'",
      // Prevent loading resources from unexpected base URIs.
      "base-uri 'self'",
    ].join('; '),
  },
]

// ---------------------------------------------------------------------------
// Next.js config
// ---------------------------------------------------------------------------

const nextConfig: NextConfig = {
  // ---- Remote image sources ----
  images: {
    remotePatterns: [
      // Unsplash — temporary hero image in components/site/hero-section.tsx.
      // Remove this entry once final photography is uploaded to /public.
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Picsum — carried forward from original next.config.js.
      // Used as a last-resort placeholder during development.
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    // Serve WebP/AVIF for all optimised images.
    formats: ['image/avif', 'image/webp'],
    // Reasonable device sizes for a landing page + admin panel.
    deviceSizes: [375, 640, 768, 1024, 1280, 1600, 1920],
    imageSizes:  [16, 32, 48, 64, 96, 128, 256],
    // Minimise layout shift by setting a minimum cache TTL.
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },

  // ---- TypeScript route type safety ----
  // Carried forward from original next.config.js.
  experimental: {
    typedRoutes: true,
  },

  // ---- Security headers on all routes ----
  async headers() {
    return [
      {
        // Apply to every page and API route.
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  // ---- Build output ----
  // 'standalone' bundles only the files needed to run the app,
  // which is the recommended output mode for Railway deployments.
  // Railway sets NODE_ENV=production and runs `next start` automatically.
  output: 'standalone',

  // ---- Compression ----
  // Enable Gzip/Brotli compression at the Next.js layer.
  // Railway does not add a reverse proxy with compression by default.
  compress: true,

  // ---- TypeScript and ESLint during build ----
  // In production, fail the build on TypeScript errors.
  // Lint warnings are tolerated (warnings: false keeps build logs clean).
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    // Run ESLint during build to catch issues before deploy.
    ignoreDuringBuilds: false,
  },

  // ---- Logging ----
  logging: {
    fetches: {
      // Log slow fetches in development for debugging.
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
}

export default nextConfig
