import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, localeHeader, localizePath, stripLocaleFromPathname } from "./i18n/config";

const publicFilePattern = /\.[^/]+$/;
const bypassPrefixes = ["/_next", "/api", "/images", "/studio", "/videos"];

function shouldBypass(pathname: string) {
  return bypassPrefixes.some((prefix) => pathname.startsWith(prefix)) || publicFilePattern.test(pathname);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0]?.toLowerCase();

  if (!isLocale(firstSegment)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = localizePath(pathname, defaultLocale);
    return NextResponse.redirect(redirectUrl);
  }

  const headers = new Headers(request.headers);
  headers.set(localeHeader, firstSegment);

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = stripLocaleFromPathname(pathname);

  return NextResponse.rewrite(rewriteUrl, {
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
