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

    // Delete domain
    await prisma.domain.delete({
      where: { id: domainId },
    })

    // In production, you would also:
    // Remove the domain from Vercel using their API

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Remove domain error:", error)
    return NextResponse.json({ error: "Failed to remove domain" }, { status: 500 })
  }
}
