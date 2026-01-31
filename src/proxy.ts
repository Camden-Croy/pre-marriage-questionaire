import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import {
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_DASHBOARD_REDIRECT,
  UNAUTHORIZED_REDIRECT,
} from "@/routes";

/**
 * Hardcoded whitelist of authorized emails
 * Add or remove emails as needed
 */
const WHITELISTED_EMAILS = [
  "camdencroy4@gmail.com",
  "camden@transformwebsolutions.com",
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
  
  console.log("Proxy running for:", pathname);
  
  const session = await getSession();
  const isLoggedIn = !!session?.user;

  console.log("Session:", { isLoggedIn, email: session?.user?.email });

  const isAuthRoute = authRoutes.includes(pathname);
  const isUnauthorizedRoute = pathname === UNAUTHORIZED_REDIRECT;

  // Allow API routes to pass through
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Handle logged-in users - whitelist check takes priority
  if (isLoggedIn && session?.user?.email) {
    const isWhitelisted = isEmailWhitelisted(session.user.email);
    console.log("Whitelist check:", { email: session.user.email, isWhitelisted });

    // Non-whitelisted users can ONLY access the unauthorized page
    if (!isWhitelisted) {
      if (!isUnauthorizedRoute) {
        console.log("Redirecting non-whitelisted user to unauthorized");
        return NextResponse.redirect(new URL(UNAUTHORIZED_REDIRECT, request.url));
      }
      return NextResponse.next();
    }

    // Whitelisted users should not see unauthorized page
    if (isUnauthorizedRoute) {
      return NextResponse.redirect(new URL(DEFAULT_DASHBOARD_REDIRECT, request.url));
    }

    // Whitelisted users on auth routes go to dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL(DEFAULT_DASHBOARD_REDIRECT, request.url));
    }

    return NextResponse.next();
  }

  // Non-logged-in users: only allow auth routes and unauthorized page
  if (!isAuthRoute && !isUnauthorizedRoute) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
