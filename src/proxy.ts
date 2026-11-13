import { localeFromSegment, segmentFromLocale } from "@/i18n";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const segment = request.nextUrl.pathname.split("/")[1];
  const locale = localeFromSegment(segment);

  if (locale && segmentFromLocale(locale) !== segment) {
    const canonicalUrl = request.nextUrl.clone();
    const trailingPath = request.nextUrl.pathname.split("/").slice(2).join("/");
    const canonicalSegment = segmentFromLocale(locale);
    canonicalUrl.pathname = trailingPath ? `/${canonicalSegment}/${trailingPath}` : `/${canonicalSegment}`;
    return NextResponse.redirect(canonicalUrl, 308);
  }

  // Published locale pages (including English fallback redirects) are static.
  // Only query-bearing document requests need to preserve tracking parameters
  // through a cached redirect. Inspect the query-free CDN response, never CMS.
  if (locale && request.method === "GET" && request.nextUrl.search &&
      !request.nextUrl.searchParams.has("_rsc") && !request.headers.has("rsc")) {
    const url = request.nextUrl.clone();
    url.search = "";
    try {
      const response = await fetch(url, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(3000) });
      const location = response.headers.get("location");
      if (location && [301, 302, 303, 307, 308].includes(response.status)) {
        const target = new URL(location, url);
        if (target.origin === url.origin) {
          request.nextUrl.searchParams.forEach((value, key) => target.searchParams.append(key, value));
          return NextResponse.redirect(target, response.status);
        }
      }
    } catch {
      // Routing remains available if the CDN probe times out.
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/:locale([fF][rR]-[cC][aA]|[zZ][hH]-[hH][aA][nN][tT]|[jJ][aA]-[jJ][pP])/:path*",
  ],
};
