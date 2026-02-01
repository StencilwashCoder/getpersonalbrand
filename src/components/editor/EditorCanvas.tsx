"use client"

import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Block } from "@/types/blocks"
import { BlockRenderer } from "@/components/blocks"
import { GripVertical, Trash2 } from "lucide-react"

interface SortableBlockProps {
  block: Block
  primaryColor: string
  onUpdate: (blockId: string, data: Block["data"]) => void
  onDelete: (blockId: string) => void
}

function SortableBlock({ block, primaryColor, onUpdate, onDelete }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
    >
      {/* Drag Handle and Delete */}
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          {...attributes}
          {...listeners}
          className="p-1 bg-gray-100 rounded hover:bg-gray-200 cursor-grab"
        >
          <GripVertical className="w-4 h-4 text-gray-500" />
        </button>
        <button
          onClick={() => onDelete(block.id)}
          className="p-1 bg-red-100 rounded hover:bg-red-200"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>

      <BlockRenderer
        block={block}
        isEditing={true}
        onUpdate={(data) => onUpdate(block.id, data)}
        primaryColor={primaryColor}
      />
    </div>
  )
}

interface EditorCanvasProps {
  blocks: Block[]
  primaryColor: string
  onUpdateBlock: (blockId: string, data: Block["data"]) => void
  onDeleteBlock: (blockId: string) => void
}

export function EditorCanvas({
  blocks,
  primaryColor,
  onUpdateBlock,
  onDeleteBlock,
}: EditorCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
  })

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div
          ref={setNodeRef}
          className={`min-h-[600px] p-4 rounded-lg transition-colors ${
            isOver ? "bg-blue-50 border-2 border-dashed border-blue-300" : ""
          }`}
        >
          {blocks.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <p className="text-lg mb-2">Your canvas is empty</p>
                <p className="text-sm">Drag blocks from the sidebar to get started</p>
              </div>
            </div>
          ) : (
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4 pl-12">
                {blocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    primaryColor={primaryColor}
                    onUpdate={onUpdateBlock}
                    onDelete={onDeleteBlock}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  )
}
