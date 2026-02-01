"use client"

import { ContactBlock as ContactBlockType } from "@/types/blocks"
import { Mail, Calendar } from "lucide-react"

interface Props {
  block: ContactBlockType
  isEditing?: boolean
  onUpdate?: (data: ContactBlockType["data"]) => void
  primaryColor?: string
}

export function ContactBlock({ block, isEditing, onUpdate, primaryColor = "#2563eb" }: Props) {
  const { title, email, calendarUrl } = block.data

  const handleChange = (field: keyof ContactBlockType["data"], value: string | boolean | null) => {
    if (onUpdate) {
      onUpdate({ ...block.data, [field]: value })
    }
  }

  return (
    <div className="py-8 px-4 max-w-md mx-auto text-center">
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-dashed border-gray-300 focus:border-blue-500 focus:outline-none w-full mb-6 text-center"
          placeholder="Section Title"
        />
      ) : (
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      )}

      <div className="space-y-4">
        {/* Email */}
        {isEditing ? (
          <div className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg">
            <Mail className="w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email || ""}
              onChange={(e) => handleChange("email", e.target.value || null)}
              className="flex-1 bg-transparent border-none focus:outline-none"
              placeholder="your@email.com"
            />
          </div>
        ) : email ? (
          <a
            href={`mailto:${email}`}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            <Mail className="w-5 h-5" />
            Email Me
          </a>
        ) : null}

        {/* Calendar Link */}
        {isEditing ? (
          <div className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={calendarUrl || ""}
              onChange={(e) => handleChange("calendarUrl", e.target.value || null)}
              className="flex-1 bg-transparent border-none focus:outline-none"
              placeholder="https://calendly.com/..."
            />
          </div>
        ) : calendarUrl ? (
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 transition-colors hover:bg-gray-50"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            <Calendar className="w-5 h-5" />
            Book a Call
          </a>
        ) : null}
      </div>
    </div>
  )
}
