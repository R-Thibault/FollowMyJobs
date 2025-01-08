// middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// Public routes that don't require authentication
const publicRoutes = [
  "/", // Root path for language detection
  "/login",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

// Initialize next-intl middleware for language detection and redirects
const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;
  const locale = req.nextUrl.locale || "en"; // Default locale fallback

  //  Allow all language root paths without a token
  const isHomepage = pathname === `/${locale}`;

  // Allow all defined public routes and localized public routes without a token
  const isPublicPage =
    publicRoutes.includes(pathname) ||
    publicRoutes.includes(pathname.replace(`/${locale}`, "")) ||
    isHomepage;

  //  If on a public page, allow access without token
  if (isPublicPage) {
    return intlMiddleware(req); // Let next-intl handle locale detection
  }

  //  If accessing a protected route without a token, redirect to login
  if (!token) {
    const redirectUrl = `/${locale}/login`;
    if (pathname !== redirectUrl) {
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
  }

  //  If authenticated, allow the request to proceed
  return intlMiddleware(req);
}

//  Target all locale-based routes and exclude static assets
export const config = {
  matcher: ["/", "/(fr|en)/:path*"],
};
