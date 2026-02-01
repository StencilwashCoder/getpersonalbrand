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

    const { siteId, blocks, theme } = await req.json()

    // Verify ownership
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      select: { userId: true },
    })

    if (!site || site.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update site
    await prisma.site.update({
      where: { id: siteId },
      data: {
        content: blocks,
        theme: theme,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Save error:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}
