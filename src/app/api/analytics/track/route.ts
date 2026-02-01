import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

// Simple country lookup from Accept-Language header as fallback
function getCountryFromHeaders(headersList: Headers): string | null {
  // In production, you'd use a geo IP service
  const acceptLanguage = headersList.get("accept-language")
  if (acceptLanguage) {
    // Very rough approximation - in production use MaxMind or similar
    if (acceptLanguage.includes("en-US")) return "US"
    if (acceptLanguage.includes("en-GB")) return "GB"
    if (acceptLanguage.includes("de")) return "DE"
    if (acceptLanguage.includes("fr")) return "FR"
  }
  return null
}

function getDeviceType(userAgent: string | null): string {
  if (!userAgent) return "unknown"
  if (/mobile/i.test(userAgent)) return "mobile"
  if (/tablet/i.test(userAgent)) return "tablet"
  return "desktop"
}

export async function POST(req: Request) {
  try {
    const { siteId, eventType, linkId, referrer } = await req.json()

    if (!siteId || !eventType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const headersList = await headers()
    const userAgent = headersList.get("user-agent")
    const country = getCountryFromHeaders(headersList)
    const deviceType = getDeviceType(userAgent)

    await prisma.analyticsEvent.create({
      data: {
        siteId,
        eventType,
        linkId: linkId || null,
        referrer: referrer || null,
        country,
        deviceType,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics tracking error:", error)
    // Don't fail the request if analytics fails
    return NextResponse.json({ success: true })
  }
}
