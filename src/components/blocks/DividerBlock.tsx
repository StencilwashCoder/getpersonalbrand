"use client"

import { DividerBlock as DividerBlockType } from "@/types/blocks"

interface Props {
  block: DividerBlockType
  isEditing?: boolean
  onUpdate?: (data: DividerBlockType["data"]) => void
  primaryColor?: string
}

export function DividerBlock({ block, isEditing, onUpdate, primaryColor = "#2563eb" }: Props) {
  const { style } = block.data

  const handleStyleChange = (newStyle: DividerBlockType["data"]["style"]) => {
    if (onUpdate) {
      onUpdate({ style: newStyle })
    }
  }

  const renderDivider = () => {
    switch (style) {
      case "line":
        return (
          <div className="py-4">
            <hr className="border-gray-200" />
          </div>
        )
      case "dots":
        return (
          <div className="py-4 flex justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />
            ))}
          </div>
        )
      case "space":
      default:
        return <div className="py-8" />
    }
  }

  if (isEditing) {
    return (
      <div className="py-4 px-4">
        <div className="flex items-center justify-center gap-4 p-3 border-2 border-dashed border-gray-300 rounded-lg">
          <span className="text-sm text-gray-500">Divider style:</span>
          <select
            value={style}
            onChange={(e) =>
              handleStyleChange(e.target.value as DividerBlockType["data"]["style"])
            }
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="space">Space</option>
            <option value="line">Line</option>
            <option value="dots">Dots</option>
          </select>
        </div>
      </div>
    )
  }

  return renderDivider()
}
