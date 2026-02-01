"use client"

import { HeroBlock as HeroBlockType } from "@/types/blocks"
import { User } from "lucide-react"

interface Props {
  block: HeroBlockType
  isEditing?: boolean
  onUpdate?: (data: HeroBlockType["data"]) => void
  primaryColor?: string
}

export function HeroBlock({ block, isEditing, onUpdate, primaryColor = "#2563eb" }: Props) {
  const { name, headline, bio, imageUrl } = block.data

  const handleChange = (field: keyof HeroBlockType["data"], value: string) => {
    if (onUpdate) {
      onUpdate({ ...block.data, [field]: value })
    }
  }

  return (
    <div className="text-center py-12 px-4">
      {/* Profile Image */}
      <div className="mb-6 flex justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-32 h-32 rounded-full object-cover border-4"
            style={{ borderColor: primaryColor }}
          />
        ) : (
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <User className="w-16 h-16" style={{ color: primaryColor }} />
          </div>
        )}
      </div>

      {/* Name */}
      {isEditing ? (
        <input
          type="text"
          value={name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="text-4xl font-bold text-gray-900 bg-transparent border-b-2 border-dashed border-gray-300 focus:border-blue-500 focus:outline-none text-center w-full max-w-md mx-auto"
          placeholder="Your Name"
        />
      ) : (
        <h1 className="text-4xl font-bold text-gray-900">{name}</h1>
      )}

      {/* Headline */}
      {isEditing ? (
        <input
          type="text"
          value={headline}
          onChange={(e) => handleChange("headline", e.target.value)}
          className="mt-2 text-xl text-gray-600 bg-transparent border-b-2 border-dashed border-gray-300 focus:border-blue-500 focus:outline-none text-center w-full max-w-lg mx-auto"
          placeholder="Your Headline"
        />
      ) : (
        <p className="mt-2 text-xl text-gray-600">{headline}</p>
      )}

      {/* Bio */}
      {isEditing ? (
        <textarea
          value={bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          className="mt-4 text-gray-700 bg-transparent border-2 border-dashed border-gray-300 focus:border-blue-500 focus:outline-none text-center w-full max-w-2xl mx-auto p-2 rounded resize-none"
          placeholder="Tell your story here..."
          rows={3}
        />
      ) : (
        <p className="mt-4 text-gray-700 max-w-2xl mx-auto">{bio}</p>
      )}
    </div>
  )
}
