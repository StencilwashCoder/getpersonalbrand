"use client"

import { AboutBlock as AboutBlockType } from "@/types/blocks"

interface Props {
  block: AboutBlockType
  isEditing?: boolean
  onUpdate?: (data: AboutBlockType["data"]) => void
}

export function AboutBlock({ block, isEditing, onUpdate }: Props) {
  const { title, content } = block.data

  const handleChange = (field: keyof AboutBlockType["data"], value: string) => {
    if (onUpdate) {
      onUpdate({ ...block.data, [field]: value })
    }
  }

  return (
    <div className="py-8 px-4 max-w-3xl mx-auto">
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-dashed border-gray-300 focus:border-blue-500 focus:outline-none w-full mb-4"
          placeholder="Section Title"
        />
      ) : (
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      )}

      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => handleChange("content", e.target.value)}
          className="text-gray-700 leading-relaxed bg-transparent border-2 border-dashed border-gray-300 focus:border-blue-500 focus:outline-none w-full p-3 rounded resize-none min-h-[150px]"
          placeholder="Write about yourself..."
        />
      ) : (
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</div>
      )}
    </div>
  )
}
