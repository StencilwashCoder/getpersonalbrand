"use client"

import { Block, SiteTheme } from "@/types/blocks"
import { BlockRenderer } from "@/components/blocks"

interface SiteRendererProps {
  blocks: Block[]
  theme: SiteTheme
  onLinkClick?: (linkId: string) => void
}

const FONT_FAMILIES: Record<string, string> = {
  inter: "'Inter', system-ui, sans-serif",
  georgia: "Georgia, serif",
  "system-ui": "system-ui, sans-serif",
}

export function SiteRenderer({ blocks, theme, onLinkClick }: SiteRendererProps) {
  const fontFamily = FONT_FAMILIES[theme.font] || FONT_FAMILIES.inter

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily }}
    >
      <main className="max-w-4xl mx-auto py-8">
        {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            isEditing={false}
            primaryColor={theme.primaryColor}
            onLinkClick={onLinkClick}
          />
        ))}
      </main>
    </div>
  )
}
