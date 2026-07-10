import { SOURCE_LOCALE, localeFromSegment, segmentFromLocale } from "@/i18n";
import { NextResponse, type NextRequest } from "next/server";

const LOCALE_HEADER = "x-yoramen-locale";
const PATH_HEADER = "x-yoramen-path";

export function proxy(request: NextRequest) {
  const segment = request.nextUrl.pathname.split("/")[1];
  const locale = localeFromSegment(segment);

  if (locale && segmentFromLocale(locale) !== segment) {
    const canonicalUrl = request.nextUrl.clone();
    const trailingPath = request.nextUrl.pathname.split("/").slice(2).join("/");
    const canonicalSegment = segmentFromLocale(locale);
    canonicalUrl.pathname = trailingPath ? `/${canonicalSegment}/${trailingPath}` : `/${canonicalSegment}`;
    return NextResponse.redirect(canonicalUrl, 308);
  }

  const requestHeaders = new Headers(request.headers);
  // These are internal routing headers. Always replace client-provided values.
  requestHeaders.set(LOCALE_HEADER, locale ?? SOURCE_LOCALE);
  requestHeaders.set(PATH_HEADER, `${request.nextUrl.pathname}${request.nextUrl.search}`);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|studio|images|videos|.*\\..*).*)",
  ],
};
