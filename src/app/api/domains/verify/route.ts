import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import dns from "dns"
import { promisify } from "util"

const resolveCname = promisify(dns.resolveCname)

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { domainId } = await req.json()

    // Get domain and verify ownership
    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      include: {
        site: {
          select: { userId: true },
        },
      },
    })

    if (!domain || domain.site.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check DNS
    let verified = false
    try {
      const records = await resolveCname(domain.domain)
      verified = records.some(
        (record) =>
          record.toLowerCase() === "cname.getpersonalbrand.com" ||
          record.toLowerCase().endsWith(".getpersonalbrand.com")
      )
    } catch {
      // DNS lookup failed, domain not configured
      verified = false
    }

    if (verified) {
      // Update domain status
      await prisma.domain.update({
        where: { id: domainId },
        data: {
          status: "verified",
          verifiedAt: new Date(),
        },
      })

      // In production, you would also:
      // 1. Call Vercel API to add the domain to your project
      // 2. Vercel will auto-provision SSL

      return NextResponse.json({ status: "verified" })
    }

    return NextResponse.json({ status: "pending_verification" })
  } catch (error) {
    console.error("Verify domain error:", error)
    return NextResponse.json({ error: "Failed to verify domain" }, { status: 500 })
  }
}
