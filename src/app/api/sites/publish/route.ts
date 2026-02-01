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

    const { siteId, published } = await req.json()

    // Verify ownership
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      select: { userId: true },
    })

    if (!site || site.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update published status
    await prisma.site.update({
      where: { id: siteId },
      data: { published },
    })

    return NextResponse.json({ success: true, published })
  } catch (error) {
    console.error("Publish error:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
