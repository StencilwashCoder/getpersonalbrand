import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Edit, BarChart3, ExternalLink, Settings } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      site: {
        include: {
          _count: {
            select: { analyticsEvents: true },
          },
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  // Check if user needs to complete onboarding
  if (!user.site || (user.site.content as any[]).length === 0) {
    redirect("/onboarding")
  }

  const siteUrl = `${user.username}.getpersonalbrand.com`
  const totalViews = user.site?._count.analyticsEvents || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.name || user.username}!
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your personal brand website
        </p>
      </div>

      {/* Site Status Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Your Site</h2>
            <a
              href={`/site/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1 mt-1"
            >
              {siteUrl}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                user.site?.published
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {user.site?.published ? "Published" : "Draft"}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{totalViews}</div>
            <div className="text-sm text-gray-500">Total Page Views</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">
              {(user.site?.content as any[])?.length || 0}
            </div>
            <div className="text-sm text-gray-500">Content Blocks</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-500">Custom Domains</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/editor"
          className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Edit className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Edit Your Site</div>
            <div className="text-sm text-gray-500">
              Update content and design
            </div>
          </div>
        </Link>

        <Link
          href="/analytics"
          className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">View Analytics</div>
            <div className="text-sm text-gray-500">
              Track visitors and engagement
            </div>
          </div>
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Settings</div>
            <div className="text-sm text-gray-500">
              Domains and account settings
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
