"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageEditor } from "@/components/editor"
import { Block, SiteTheme } from "@/types/blocks"

interface EditorClientProps {
  siteId: string
  username: string
  initialBlocks: Block[]
  initialTheme: SiteTheme
  isPublished: boolean
}

export function EditorClient({
  siteId,
  username,
  initialBlocks,
  initialTheme,
  isPublished,
}: EditorClientProps) {
  const router = useRouter()
  const [published, setPublished] = useState(isPublished)

  const handleSave = async (blocks: Block[], theme: SiteTheme) => {
    const response = await fetch("/api/sites/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, blocks, theme }),
    })

    if (!response.ok) {
      throw new Error("Failed to save")
    }
  }

  const handlePreview = () => {
    window.open(`/site/${username}`, "_blank")
  }

  const handlePublish = async () => {
    const response = await fetch("/api/sites/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, published: !published }),
    })

    if (response.ok) {
      setPublished(!published)
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <PageEditor
        initialBlocks={initialBlocks}
        initialTheme={initialTheme}
        onSave={handleSave}
        onPreview={handlePreview}
        username={username}
      />

      {/* Publish Toggle */}
      <div className="fixed bottom-4 right-4 flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
        <span className="text-sm text-gray-600">
          {published ? "Site is live" : "Site is draft"}
        </span>
        <button
          onClick={handlePublish}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            published
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {published ? "Unpublish" : "Publish Site"}
        </button>
      </div>
    </div>
  )
}
