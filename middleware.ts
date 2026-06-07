import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const res = NextResponse.next();

  // Prevent clickjacking
  res.headers.set("X-Frame-Options", "DENY");

  // Stop MIME-type sniffing
  res.headers.set("X-Content-Type-Options", "nosniff");

  // Enable XSS filter in older browsers
  res.headers.set("X-XSS-Protection", "1; mode=block");

  // Limit referrer information sent to external sites
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Only allow HTTPS
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // Permissions policy — disable features not needed
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    // Inline styles needed for Framer Motion / Tailwind
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    // Supabase API calls
    "connect-src 'self' https://*.supabase.co",
    // External links (Google Maps) open in new tab — no embed
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // Scripts: allow Next.js inline scripts via nonce-less hash approach
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "img-src 'self' data: blob:",
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);

  return res;
}

export const config = {
  matcher: [
    // Apply to all routes except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
