"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { Block, BlockType, SiteTheme, createBlock, DEFAULT_THEME } from "@/types/blocks"
import { BlockSidebar } from "./BlockSidebar"
import { EditorCanvas } from "./EditorCanvas"
import { ThemePanel } from "./ThemePanel"
import { Save, Eye, Settings } from "lucide-react"

interface PageEditorProps {
  initialBlocks: Block[]
  initialTheme: SiteTheme
  onSave: (blocks: Block[], theme: SiteTheme) => Promise<void>
  onPreview: () => void
  username: string
}

export function PageEditor({
  initialBlocks,
  initialTheme,
  onSave,
  onPreview,
  username,
}: PageEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [theme, setTheme] = useState<SiteTheme>(initialTheme || DEFAULT_THEME)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showThemePanel, setShowThemePanel] = useState(false)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    // Handle new block from sidebar
    if (active.data.current?.type === "new-block") {
      const blockType = active.data.current.blockType as BlockType
      const newBlock = createBlock(blockType)

      // Find insert position
      if (over.id === "canvas") {
        setBlocks((prev) => [...prev, newBlock])
      } else {
        const overIndex = blocks.findIndex((b) => b.id === over.id)
        if (overIndex !== -1) {
          setBlocks((prev) => {
            const newBlocks = [...prev]
            newBlocks.splice(overIndex, 0, newBlock)
            return newBlocks
          })
        } else {
          setBlocks((prev) => [...prev, newBlock])
        }
      }
      setHasChanges(true)
      return
    }

    // Handle reordering existing blocks
    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        setBlocks((prev) => arrayMove(prev, oldIndex, newIndex))
        setHasChanges(true)
      }
    }
  }

  const handleUpdateBlock = useCallback((blockId: string, data: Block["data"]) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, data } : block
      ) as Block[]
    )
    setHasChanges(true)
  }, [])

  const handleDeleteBlock = useCallback((blockId: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== blockId))
    setHasChanges(true)
  }, [])

  const handleThemeUpdate = useCallback((newTheme: SiteTheme) => {
    setTheme(newTheme)
    setHasChanges(true)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(blocks, theme)
      setHasChanges(false)
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-gray-900">Page Editor</h1>
          <span className="text-sm text-gray-500">
            {username}.getpersonalbrand.com
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowThemePanel(!showThemePanel)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              showThemePanel
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <Settings className="w-4 h-4" />
            Theme
          </button>

          <button
            onClick={onPreview}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg text-gray-700"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : hasChanges ? "Save Changes" : "Saved"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <BlockSidebar />

          <EditorCanvas
            blocks={blocks}
            primaryColor={theme.primaryColor}
            onUpdateBlock={handleUpdateBlock}
            onDeleteBlock={handleDeleteBlock}
          />

          <DragOverlay>
            {activeId ? (
              <div className="bg-white p-4 rounded-lg shadow-lg border border-blue-300 opacity-80">
                Dragging...
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {showThemePanel && <ThemePanel theme={theme} onUpdate={handleThemeUpdate} />}
      </div>
    </div>
  )
}
