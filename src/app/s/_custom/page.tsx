import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { SiteRenderer } from "@/components/site/SiteRenderer"
import { Block, SiteTheme, DEFAULT_THEME } from "@/types/blocks"
import { AnalyticsTracker } from "../[username]/analytics-tracker"

async function getSiteByDomain(domain: string) {
  const domainRecord = await prisma.domain.findUnique({
    where: { domain, status: "verified" },
    include: {
      site: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!domainRecord || !domainRecord.site.published) {
    return null
  }

  return {
    user: {
      name: domainRecord.site.user.name,
      username: domainRecord.site.user.username,
    },
    site: {
      id: domainRecord.site.id,
      content: domainRecord.site.content as unknown as Block[],
      theme: (domainRecord.site.theme as unknown as SiteTheme) || DEFAULT_THEME,
    },
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const domain = headersList.get("x-custom-domain")

  if (!domain) {
    return { title: "Not Found" }
  }

  const data = await getSiteByDomain(domain)

  if (!data) {
    return { title: "Not Found" }
  }

  const heroBlock = data.site.content.find((b) => b.type === "hero")
  const description = heroBlock?.type === "hero" ? heroBlock.data.bio : undefined

  return {
    title: data.user.name || data.user.username,
    description: description?.slice(0, 160),
  }
}

export default async function CustomDomainPage() {
  const headersList = await headers()
  const domain = headersList.get("x-custom-domain")

  if (!domain) {
    notFound()
  }

  const data = await getSiteByDomain(domain)

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

export const revalidate = 60
