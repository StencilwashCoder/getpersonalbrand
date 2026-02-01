"use client"

import { useEffect } from "react"

interface AnalyticsTrackerProps {
  siteId: string
}

export function AnalyticsTracker({ siteId }: AnalyticsTrackerProps) {
  useEffect(() => {
    // Track page view
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteId,
        eventType: "page_view",
        referrer: document.referrer || null,
      }),
    }).catch(console.error)
  }, [siteId])

  return null
}
