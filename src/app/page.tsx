import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ArrowRight, Link as LinkIcon, User, Grid3X3, BarChart3 } from "lucide-react"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-900">GetPersonalBrand</div>
          <div className="flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your personal brand,
            <br />
            <span className="text-blue-600">one powerful site</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Replace Linktree, your bio site, and portfolio with one professional
            website. Build it in minutes, own it forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium"
            >
              Start Building Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-lg font-medium"
            >
              See Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Everything you need in one place
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Stop juggling multiple tools. GetPersonalBrand combines your links,
            bio, and portfolio into one beautiful site.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <LinkIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Link Hub</h3>
              <p className="text-gray-600 text-sm">
                All your social links in one place. Twitter, LinkedIn, GitHub,
                and more.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Bio Page</h3>
              <p className="text-gray-600 text-sm">
                Tell your story with a professional bio and profile. Make a
                great first impression.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Grid3X3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Portfolio</h3>
              <p className="text-gray-600 text-sm">
                Showcase your best work with a beautiful project grid. Let your
                work speak.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">
                Track who&apos;s visiting your site. See page views, link clicks, and
                referrers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Live in 5 minutes
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  Pick a template
                </h3>
                <p className="text-gray-600">
                  Choose from our professionally designed templates. Modern,
                  Bold, or Classic - pick the one that matches your vibe.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  Add your content
                </h3>
                <p className="text-gray-600">
                  Fill in your profile, add your links, and showcase your work.
                  Our drag-and-drop editor makes it easy.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  Go live
                </h3>
                <p className="text-gray-600">
                  Hit publish and your site is live. Share your unique URL or
                  connect your own domain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to build your brand?
          </h2>
          <p className="text-blue-100 mb-8">
            Join thousands of professionals who own their online presence.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 text-lg font-medium"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} GetPersonalBrand. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
