import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_ADMIN_PREFIX = "/admin";
const PROTECTED_MEMBER_SEGMENT = "/communaute/ressources-membres";

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith(PROTECTED_ADMIN_PREFIX);
}

function isMemberRoute(pathname: string): boolean {
  return pathname.includes(PROTECTED_MEMBER_SEGMENT);
}

export default function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (isAdminRoute(pathname)) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyToken(token) : null;

    if (!payload || payload.role !== "ADMIN") {
      const loginUrl = new URL("/fr/communaute/connexion", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  if (isMemberRoute(pathname)) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyToken(token) : null;

    if (!payload) {
      const localeMatch = pathname.match(/^\/(fr|en)\//);
      const locale = localeMatch ? localeMatch[1] : "fr";
      const loginUrl = new URL(`/${locale}/communaute/connexion`, request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return intlMiddleware(request);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};