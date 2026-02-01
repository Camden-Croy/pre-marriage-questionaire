import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import {
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_DASHBOARD_REDIRECT,
} from "@/routes";

/**
 * Hardcoded whitelist of authorized emails
 * Add or remove emails as needed
 */
const WHITELISTED_EMAILS = [
  "camdencroy4@gmail.com",
  "jordanmstacy1@gmail.com",
  // Add more authorized emails here
];

/**
 * Check if an email is in the whitelist
 */
function isEmailWhitelisted(email: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();
  return WHITELISTED_EMAILS.map((e) => e.toLowerCase().trim()).includes(normalizedEmail);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const session = await getSession();
  const isLoggedIn = !!session?.user;
  const isAuthRoute = authRoutes.includes(pathname);

  // Allow API routes to pass through
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Allow public /topics route
  if (pathname.startsWith("/topics")) {
    return NextResponse.next();
  }

  // Handle logged-in users
  if (isLoggedIn && session?.user?.email) {
    const isWhitelisted = isEmailWhitelisted(session.user.email);

    // Non-whitelisted users get redirected back to login
    if (!isWhitelisted) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT + "?error=access_denied", request.url));
    }

    // Whitelisted users on auth routes go to dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL(DEFAULT_DASHBOARD_REDIRECT, request.url));
    }

    return NextResponse.next();
  }

  // Non-logged-in users: only allow auth routes
  if (!isAuthRoute) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
