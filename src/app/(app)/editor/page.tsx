import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { EditorClient } from "./editor-client"
import { Block, SiteTheme, DEFAULT_THEME } from "@/types/blocks"

export default async function EditorPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { site: true },
  })

  if (!user || !user.site) {
    redirect("/onboarding")
  }

  const blocks = (user.site.content as unknown as Block[]) || []
  const theme = (user.site.theme as unknown as SiteTheme) || DEFAULT_THEME

  return (
    <EditorClient
      siteId={user.site.id}
      username={user.username}
      initialBlocks={blocks}
      initialTheme={theme}
      isPublished={user.site.published}
    />
  )
}
