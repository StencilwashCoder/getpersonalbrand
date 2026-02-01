"use client"

import { useDraggable } from "@dnd-kit/core"
import { BlockType } from "@/types/blocks"
import {
  User,
  FileText,
  Link,
  Grid3X3,
  Mail,
  Minus,
} from "lucide-react"

interface BlockTypeConfig {
  type: BlockType
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const BLOCK_TYPES: BlockTypeConfig[] = [
  { type: "hero", label: "Hero", icon: User, description: "Profile header with photo and bio" },
  { type: "about", label: "About", icon: FileText, description: "Longer text section" },
  { type: "links", label: "Links", icon: Link, description: "Social links and buttons" },
  { type: "portfolio", label: "Portfolio", icon: Grid3X3, description: "Project showcase grid" },
  { type: "contact", label: "Contact", icon: Mail, description: "Email and calendar links" },
  { type: "divider", label: "Divider", icon: Minus, description: "Space or visual separator" },
]

interface DraggableBlockTypeProps {
  config: BlockTypeConfig
}

function DraggableBlockType({ config }: DraggableBlockTypeProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-${config.type}`,
    data: {
      type: "new-block",
      blockType: config.type,
    },
  })

  const Icon = config.icon

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-3 border border-gray-200 rounded-lg cursor-grab hover:border-blue-500 hover:bg-blue-50 transition-colors ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <div className="font-medium text-gray-900">{config.label}</div>
          <div className="text-xs text-gray-500">{config.description}</div>
        </div>
      </div>
    </div>
  )
}

export function BlockSidebar() {
  return (
    <div className="w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="font-semibold text-gray-900 mb-4">Add Blocks</h3>
      <p className="text-sm text-gray-500 mb-4">
        Drag blocks to the canvas to build your page
      </p>
      <div className="space-y-2">
        {BLOCK_TYPES.map((config) => (
          <DraggableBlockType key={config.type} config={config} />
        ))}
      </div>
    </div>
  )
}
