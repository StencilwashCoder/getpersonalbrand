import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get("days") || "30")

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { site: true },
    })

    if (!user?.site) {
      return NextResponse.json({ error: "No site found" }, { status: 404 })
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get all events in the time range
    const events = await prisma.analyticsEvent.findMany({
      where: {
        siteId: user.site.id,
        timestamp: { gte: startDate },
      },
      orderBy: { timestamp: "asc" },
    })

    // Calculate stats
    const pageViews = events.filter((e) => e.eventType === "page_view")
    const linkClicks = events.filter((e) => e.eventType === "link_click")

    // Group by day for time series
    const viewsByDay: Record<string, number> = {}
    pageViews.forEach((event) => {
      const day = event.timestamp.toISOString().split("T")[0]
      viewsByDay[day] = (viewsByDay[day] || 0) + 1
    })

    // Fill in missing days
    const timeSeries: { date: string; views: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      timeSeries.push({
        date: dateStr,
        views: viewsByDay[dateStr] || 0,
      })
    }

    // Group referrers
    const referrerCounts: Record<string, number> = {}
    pageViews.forEach((event) => {
      const ref = event.referrer || "Direct"
      // Extract domain from referrer
      let domain = "Direct"
      if (event.referrer) {
        try {
          domain = new URL(event.referrer).hostname
        } catch {
          domain = event.referrer
        }
      }
      referrerCounts[domain] = (referrerCounts[domain] || 0) + 1
    })

    const referrers = Object.entries(referrerCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Group link clicks
    const linkClickCounts: Record<string, number> = {}
    linkClicks.forEach((event) => {
      if (event.linkId) {
        linkClickCounts[event.linkId] = (linkClickCounts[event.linkId] || 0) + 1
      }
    })

    const topLinks = Object.entries(linkClickCounts)
      .map(([linkId, clicks]) => ({ linkId, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)

    // Device breakdown
    const deviceCounts: Record<string, number> = {}
    pageViews.forEach((event) => {
      const device = event.deviceType || "unknown"
      deviceCounts[device] = (deviceCounts[device] || 0) + 1
    })

    const devices = Object.entries(deviceCounts)
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      totalViews: pageViews.length,
      totalClicks: linkClicks.length,
      timeSeries,
      referrers,
      topLinks,
      devices,
    })
  } catch (error) {
    console.error("Analytics stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
