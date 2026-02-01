import { Block, SiteTheme } from "@/types/blocks"

export interface Template {
  id: string
  name: string
  description: string
  preview: string // Placeholder - would be image URL
  theme: SiteTheme
  blocks: Block[]
}

export const TEMPLATES: Template[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean, minimal design with lots of white space",
    preview: "/templates/modern.png",
    theme: {
      primaryColor: "#2563eb",
      font: "inter",
      template: "modern",
    },
    blocks: [
      {
        id: "hero-1",
        type: "hero",
        data: {
          name: "Your Name",
          headline: "What you do best",
          bio: "A brief introduction about yourself and what makes you unique. Share your passion and what drives you.",
          imageUrl: null,
        },
      },
      {
        id: "links-1",
        type: "links",
        data: {
          links: [
            { id: "l1", label: "Twitter", url: "", icon: "twitter" },
            { id: "l2", label: "LinkedIn", url: "", icon: "linkedin" },
            { id: "l3", label: "GitHub", url: "", icon: "github" },
          ],
        },
      },
      {
        id: "divider-1",
        type: "divider",
        data: { style: "space" },
      },
      {
        id: "about-1",
        type: "about",
        data: {
          title: "About Me",
          content:
            "Share your story here. What's your background? What are you passionate about? What do you do for work or fun?\n\nThis is your space to connect with visitors and help them understand who you are.",
        },
      },
      {
        id: "portfolio-1",
        type: "portfolio",
        data: {
          title: "My Work",
          projects: [],
        },
      },
      {
        id: "contact-1",
        type: "contact",
        data: {
          title: "Get in Touch",
          email: null,
          calendarUrl: null,
          showForm: false,
        },
      },
    ],
  },
  {
    id: "bold",
    name: "Bold",
    description: "Strong typography with dark accents",
    preview: "/templates/bold.png",
    theme: {
      primaryColor: "#7c3aed",
      font: "inter",
      template: "bold",
    },
    blocks: [
      {
        id: "hero-1",
        type: "hero",
        data: {
          name: "Your Name",
          headline: "Making an impact",
          bio: "Bold statement about who you are and what you stand for. Make it memorable.",
          imageUrl: null,
        },
      },
      {
        id: "links-1",
        type: "links",
        data: {
          links: [
            { id: "l1", label: "Twitter", url: "", icon: "twitter" },
            { id: "l2", label: "Instagram", url: "", icon: "instagram" },
            { id: "l3", label: "YouTube", url: "", icon: "youtube" },
          ],
        },
      },
      {
        id: "portfolio-1",
        type: "portfolio",
        data: {
          title: "Featured Work",
          projects: [],
        },
      },
      {
        id: "contact-1",
        type: "contact",
        data: {
          title: "Let's Connect",
          email: null,
          calendarUrl: null,
          showForm: false,
        },
      },
    ],
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional professional look",
    preview: "/templates/classic.png",
    theme: {
      primaryColor: "#0d9488",
      font: "georgia",
      template: "classic",
    },
    blocks: [
      {
        id: "hero-1",
        type: "hero",
        data: {
          name: "Your Name",
          headline: "Professional Title",
          bio: "A professional summary of your experience and expertise. Highlight your credentials and what you bring to the table.",
          imageUrl: null,
        },
      },
      {
        id: "about-1",
        type: "about",
        data: {
          title: "Professional Background",
          content:
            "Detail your professional journey, key achievements, and areas of expertise. This is your digital resume summary.",
        },
      },
      {
        id: "divider-1",
        type: "divider",
        data: { style: "line" },
      },
      {
        id: "links-1",
        type: "links",
        data: {
          links: [
            { id: "l1", label: "LinkedIn", url: "", icon: "linkedin" },
            { id: "l2", label: "Email", url: "", icon: "email" },
          ],
        },
      },
      {
        id: "contact-1",
        type: "contact",
        data: {
          title: "Contact",
          email: null,
          calendarUrl: null,
          showForm: false,
        },
      },
    ],
  },
]

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id)
}

export function cloneTemplateBlocks(blocks: Block[]): Block[] {
  return blocks.map((block) => ({
    ...block,
    id: crypto.randomUUID(),
    data: JSON.parse(JSON.stringify(block.data)),
  })) as Block[]
}
