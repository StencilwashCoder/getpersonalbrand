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

    const { blocks, theme } = await req.json()

    // Get or create site
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { site: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.site) {
      // Update existing site
      await prisma.site.update({
        where: { id: user.site.id },
        data: {
          content: blocks,
          theme: theme,
          published: true,
        },
      })
    } else {
      // Create new site
      await prisma.site.create({
        data: {
          userId: user.id,
          content: blocks,
          theme: theme,
          published: true,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 })
  }
}
