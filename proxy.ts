import { NextResponse, type NextRequest } from "next/server";

export function proxy(_request: NextRequest) {
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
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "img-src 'self' data: blob:",
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
