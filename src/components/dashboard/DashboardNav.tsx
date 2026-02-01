"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Edit,
  BarChart3,
  Settings,
  LogOut,
  Globe,
} from "lucide-react"

interface DashboardNavProps {
  user: {
    name?: string | null
    email?: string | null
    username: string
  }
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/editor", label: "Editor", icon: Edit },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">
                GetPersonalBrand
              </span>
            </Link>

            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`/site/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Globe className="w-4 h-4" />
              View Site
            </a>

            <div className="border-l border-gray-200 h-6" />

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">
                {user.name || user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
