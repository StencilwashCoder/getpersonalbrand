import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get("host") || ""
  const pathname = url.pathname

  // Get the base domain from environment
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "getpersonalbrand.com"

  // Determine if this is localhost for development
  const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1")

  // Skip middleware for static files and api routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // Static files
  ) {
    return NextResponse.next()
  }

  // For localhost development, use path-based routing
  // /site/username routes to user sites
  if (isLocalhost) {
    // If path starts with /site/, treat as published site
    if (pathname.startsWith("/site/")) {
      const pathParts = pathname.split("/")
      const username = pathParts[2]
      if (username) {
        // Rewrite to the site renderer
        url.pathname = `/s/${username}${pathParts.slice(3).join("/") || ""}`
        return NextResponse.rewrite(url)
      }
    }
    // Otherwise, serve app pages normally
    return NextResponse.next()
  }

  // Production routing based on hostname

  // Check if it's the app subdomain (app.getpersonalbrand.com)
  if (hostname === `app.${appDomain}`) {
    return NextResponse.next()
  }

  // Check if it's a subdomain of the main domain
  if (hostname.endsWith(`.${appDomain}`)) {
    const subdomain = hostname.replace(`.${appDomain}`, "")

    // Rewrite to the site renderer
    url.pathname = `/s/${subdomain}${pathname}`
    return NextResponse.rewrite(url)
  }

  // Check if it's the root domain
  if (hostname === appDomain || hostname === `www.${appDomain}`) {
    return NextResponse.next()
  }

  // Otherwise, treat as custom domain
  // Store the hostname for lookup in the page
  const response = NextResponse.rewrite(new URL(`/s/_custom${pathname}`, request.url))
  response.headers.set("x-custom-domain", hostname)
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
}
