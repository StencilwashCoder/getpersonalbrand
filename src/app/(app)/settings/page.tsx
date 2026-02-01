import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DomainManager } from "./domain-manager"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      site: {
        include: {
          domains: true,
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      {/* Account Section */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Email
            </label>
            <div className="text-gray-900">{user.email}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Username
            </label>
            <div className="text-gray-900">@{user.username}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Site URL
            </label>
            <a
              href={`/site/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {user.username}.getpersonalbrand.com
            </a>
          </div>
        </div>
      </section>

      {/* Domains Section */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Custom Domains
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Connect your own domain to your personal brand site.
        </p>

        {user.site && (
          <DomainManager
            siteId={user.site.id}
            domains={user.site.domains}
          />
        )}
      </section>
    </div>
  )
}
