"use client"

import { LinksBlock as LinksBlockType, LinkItem } from "@/types/blocks"
import {
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Youtube,
  Globe,
  Mail,
  Facebook,
  Link as LinkIcon,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  website: Globe,
  email: Mail,
  default: LinkIcon,
}

interface Props {
  block: LinksBlockType
  isEditing?: boolean
  onUpdate?: (data: LinksBlockType["data"]) => void
  primaryColor?: string
  onLinkClick?: (linkId: string) => void
}

export function LinksBlock({
  block,
  isEditing,
  onUpdate,
  primaryColor = "#2563eb",
  onLinkClick,
}: Props) {
  const { links } = block.data

  const handleLinkChange = (linkId: string, field: keyof LinkItem, value: string) => {
    if (onUpdate) {
      const updatedLinks = links.map((link) =>
        link.id === linkId ? { ...link, [field]: value } : link
      )
      onUpdate({ links: updatedLinks })
    }
  }

  const addLink = () => {
    if (onUpdate) {
      onUpdate({
        links: [
          ...links,
          { id: crypto.randomUUID(), label: "New Link", url: "", icon: "default" },
        ],
      })
    }
  }

  const removeLink = (linkId: string) => {
    if (onUpdate) {
      onUpdate({ links: links.filter((link) => link.id !== linkId) })
    }
  }

  const handleClick = (link: LinkItem) => {
    if (!isEditing && link.url) {
      onLinkClick?.(link.id)
      window.open(link.url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="py-8 px-4 max-w-md mx-auto">
      <div className="space-y-3">
        {links.map((link) => {
          const Icon = ICON_MAP[link.icon] || ICON_MAP.default

          return (
            <div key={link.id} className="flex items-center gap-2">
              {isEditing && (
                <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
              )}

              <button
                onClick={() => handleClick(link)}
                className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                  isEditing
                    ? "border-dashed border-gray-300"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
                style={
                  !isEditing
                    ? { "--hover-color": primaryColor } as React.CSSProperties
                    : undefined
                }
                disabled={isEditing}
              >
                <Icon className="w-5 h-5" style={{ color: primaryColor }} />

                {isEditing ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => handleLinkChange(link.id, "label", e.target.value)}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm font-medium"
                      placeholder="Label"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleLinkChange(link.id, "url", e.target.value)}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm text-gray-500"
                      placeholder="https://..."
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ) : (
                  <span className="font-medium text-gray-800">{link.label}</span>
                )}
              </button>

              {isEditing && (
                <div className="flex gap-1">
                  <select
                    value={link.icon}
                    onChange={(e) => handleLinkChange(link.id, "icon", e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="github">GitHub</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="facebook">Facebook</option>
                    <option value="website">Website</option>
                    <option value="email">Email</option>
                    <option value="default">Link</option>
                  </select>
                  <button
                    onClick={() => removeLink(link.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {isEditing && (
        <button
          onClick={addLink}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      )}
    </div>
  )
}
