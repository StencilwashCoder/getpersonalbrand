import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { siteId, domain } = await req.json()

    // Validate domain format
    const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: "Invalid domain format" },
        { status: 400 }
      )
    }

    // Verify ownership of site
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      select: { userId: true },
    })

    if (!site || site.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if domain already exists
    const existingDomain = await prisma.domain.findUnique({
      where: { domain },
    })

    if (existingDomain) {
      return NextResponse.json(
        { error: "Domain already in use" },
        { status: 400 }
      )
    }

    // Create domain record
    const newDomain = await prisma.domain.create({
      data: {
        siteId,
        domain,
        status: "pending_verification",
      },
    })

    return NextResponse.json({ domain: newDomain })
  } catch (error) {
    console.error("Add domain error:", error)
    return NextResponse.json({ error: "Failed to add domain" }, { status: 500 })
  }
}
