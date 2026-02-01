"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Eye, MousePointer, Monitor, Smartphone, Tablet } from "lucide-react"

interface AnalyticsData {
  totalViews: number
  totalClicks: number
  timeSeries: { date: string; views: number }[]
  referrers: { source: string; count: number }[]
  topLinks: { linkId: string; clicks: number }[]
  devices: { device: string; count: number }[]
}

const COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a"]

const DEVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      try {
        const response = await fetch(`/api/analytics/stats?days=${days}`)
        if (response.ok) {
          const stats = await response.json()
          setData(stats)
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [days])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
          <div className="h-80 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">Failed to load analytics</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {data.totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Page Views</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MousePointer className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {data.totalClicks.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Link Clicks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Views Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Page Views Over Time
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.timeSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                }
              />
              <Bar dataKey="views" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Referrers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Referrers
          </h2>
          {data.referrers.length === 0 ? (
            <p className="text-gray-500">No referrer data yet</p>
          ) : (
            <div className="space-y-3">
              {data.referrers.map((ref, index) => (
                <div key={ref.source} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{ref.source}</div>
                    <div className="text-sm text-gray-500">
                      {ref.count} visits
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Devices */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Devices</h2>
          {data.devices.length === 0 ? (
            <p className="text-gray-500">No device data yet</p>
          ) : (
            <div className="flex items-center gap-8">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.devices}
                      dataKey="count"
                      nameKey="device"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                    >
                      {data.devices.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {data.devices.map((device, index) => {
                  const Icon = DEVICE_ICONS[device.device] || Monitor
                  return (
                    <div key={device.device} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <Icon className="w-5 h-5 text-gray-500" />
                      <span className="capitalize text-gray-900">
                        {device.device}
                      </span>
                      <span className="text-gray-500">{device.count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
