"use client"

import { Block } from "@/types/blocks"
import { HeroBlock } from "./HeroBlock"
import { AboutBlock } from "./AboutBlock"
import { LinksBlock } from "./LinksBlock"
import { PortfolioBlock } from "./PortfolioBlock"
import { ContactBlock } from "./ContactBlock"
import { DividerBlock } from "./DividerBlock"

interface BlockRendererProps {
  block: Block
  isEditing?: boolean
  onUpdate?: (data: Block["data"]) => void
  primaryColor?: string
  onLinkClick?: (linkId: string) => void
}

export function BlockRenderer({
  block,
  isEditing,
  onUpdate,
  primaryColor,
  onLinkClick,
}: BlockRendererProps) {
  switch (block.type) {
    case "hero":
      return (
        <HeroBlock
          block={block}
          isEditing={isEditing}
          onUpdate={onUpdate}
          primaryColor={primaryColor}
        />
      )
    case "about":
      return <AboutBlock block={block} isEditing={isEditing} onUpdate={onUpdate} />
    case "links":
      return (
        <LinksBlock
          block={block}
          isEditing={isEditing}
          onUpdate={onUpdate}
          primaryColor={primaryColor}
          onLinkClick={onLinkClick}
        />
      )
    case "portfolio":
      return (
        <PortfolioBlock
          block={block}
          isEditing={isEditing}
          onUpdate={onUpdate}
          primaryColor={primaryColor}
        />
      )
    case "contact":
      return (
        <ContactBlock
          block={block}
          isEditing={isEditing}
          onUpdate={onUpdate}
          primaryColor={primaryColor}
        />
      )
    case "divider":
      return (
        <DividerBlock
          block={block}
          isEditing={isEditing}
          onUpdate={onUpdate}
          primaryColor={primaryColor}
        />
      )
    default:
      return null
  }
}

export { HeroBlock, AboutBlock, LinksBlock, PortfolioBlock, ContactBlock, DividerBlock }
