import { notFound } from "next/navigation"
import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { SiteRenderer } from "@/components/site/SiteRenderer"
import { Block, SiteTheme, DEFAULT_THEME } from "@/types/blocks"
import { AnalyticsTracker } from "./analytics-tracker"

interface PageProps {
  params: Promise<{ username: string }>
}

async function getSiteData(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      site: true,
    },
  })

  if (!user || !user.site || !user.site.published) {
    return null
  }

  return {
    user: {
      name: user.name,
      username: user.username,
    },
    site: {
      id: user.site.id,
      content: user.site.content as unknown as Block[],
      theme: (user.site.theme as unknown as SiteTheme) || DEFAULT_THEME,
    },
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const data = await getSiteData(username)

  if (!data) {
    return { title: "Not Found" }
  }

  // Find hero block for meta description
  const heroBlock = data.site.content.find((b) => b.type === "hero")
  const description = heroBlock?.type === "hero" ? heroBlock.data.bio : undefined

  return {
    title: `${data.user.name || data.user.username} | GetPersonalBrand`,
    description: description?.slice(0, 160),
    openGraph: {
      title: data.user.name || data.user.username,
      description,
      type: "profile",
    },
  }
}

export default async function UserSitePage({ params }: PageProps) {
  const { username } = await params
  const data = await getSiteData(username)

  if (!data) {
    notFound()
  }

  return (
    <>
      <AnalyticsTracker siteId={data.site.id} />
      <SiteRenderer blocks={data.site.content} theme={data.site.theme} />
    </>
  )
}

// Revalidate every 60 seconds
export const revalidate = 60
