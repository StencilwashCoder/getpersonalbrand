export type BlockType = "hero" | "about" | "links" | "portfolio" | "contact" | "divider"

export interface BaseBlock {
  id: string
  type: BlockType
}

export interface HeroBlock extends BaseBlock {
  type: "hero"
  data: {
    name: string
    headline: string
    bio: string
    imageUrl: string | null
  }
}

export interface AboutBlock extends BaseBlock {
  type: "about"
  data: {
    title: string
    content: string
  }
}

export interface LinkItem {
  id: string
  label: string
  url: string
  icon: string
}

export interface LinksBlock extends BaseBlock {
  type: "links"
  data: {
    links: LinkItem[]
  }
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  imageUrl: string | null
  url: string | null
}

export interface PortfolioBlock extends BaseBlock {
  type: "portfolio"
  data: {
    title: string
    projects: PortfolioItem[]
  }
}

export interface ContactBlock extends BaseBlock {
  type: "contact"
  data: {
    title: string
    email: string | null
    calendarUrl: string | null
    showForm: boolean
  }
}

export interface DividerBlock extends BaseBlock {
  type: "divider"
  data: {
    style: "line" | "space" | "dots"
  }
}

export type Block =
  | HeroBlock
  | AboutBlock
  | LinksBlock
  | PortfolioBlock
  | ContactBlock
  | DividerBlock

export interface SiteTheme {
  primaryColor: string
  font: string
  template: string
}

export interface SiteContent {
  theme: SiteTheme
  blocks: Block[]
}

export const DEFAULT_THEME: SiteTheme = {
  primaryColor: "#2563eb",
  font: "inter",
  template: "modern",
}

export const createBlock = (type: BlockType): Block => {
  const id = crypto.randomUUID()

  switch (type) {
    case "hero":
      return {
        id,
        type: "hero",
        data: {
          name: "Your Name",
          headline: "Your Headline",
          bio: "Tell your story here...",
          imageUrl: null,
        },
      }
    case "about":
      return {
        id,
        type: "about",
        data: {
          title: "About Me",
          content: "Share more about yourself, your journey, and what you're passionate about.",
        },
      }
    case "links":
      return {
        id,
        type: "links",
        data: {
          links: [
            { id: crypto.randomUUID(), label: "Twitter", url: "", icon: "twitter" },
            { id: crypto.randomUUID(), label: "LinkedIn", url: "", icon: "linkedin" },
          ],
        },
      }
    case "portfolio":
      return {
        id,
        type: "portfolio",
        data: {
          title: "My Work",
          projects: [],
        },
      }
    case "contact":
      return {
        id,
        type: "contact",
        data: {
          title: "Get in Touch",
          email: null,
          calendarUrl: null,
          showForm: false,
        },
      }
    case "divider":
      return {
        id,
        type: "divider",
        data: {
          style: "space",
        },
      }
  }
}
