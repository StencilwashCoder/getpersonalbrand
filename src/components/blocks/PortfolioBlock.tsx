"use client"

import { PortfolioBlock as PortfolioBlockType, PortfolioItem } from "@/types/blocks"
import { Image as ImageIcon, Plus, Trash2, ExternalLink } from "lucide-react"

interface Props {
  block: PortfolioBlockType
  isEditing?: boolean
  onUpdate?: (data: PortfolioBlockType["data"]) => void
  primaryColor?: string
}

export function PortfolioBlock({ block, isEditing, onUpdate, primaryColor = "#2563eb" }: Props) {
  const { title, projects } = block.data

  const handleTitleChange = (value: string) => {
    if (onUpdate) {
      onUpdate({ ...block.data, title: value })
    }
  }

  const handleProjectChange = (
    projectId: string,
    field: keyof PortfolioItem,
    value: string | null
  ) => {
    if (onUpdate) {
      const updatedProjects = projects.map((project) =>
        project.id === projectId ? { ...project, [field]: value } : project
      )
      onUpdate({ ...block.data, projects: updatedProjects })
    }
  }

  const addProject = () => {
    if (onUpdate) {
      onUpdate({
        ...block.data,
        projects: [
          ...projects,
          {
            id: crypto.randomUUID(),
            title: "New Project",
            description: "Project description...",
            imageUrl: null,
            url: null,
          },
        ],
      })
    }
  }

  const removeProject = (projectId: string) => {
    if (onUpdate) {
      onUpdate({
        ...block.data,
        projects: projects.filter((project) => project.id !== projectId),
      })
    }
  }

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-dashed border-gray-300 focus:border-blue-500 focus:outline-none w-full mb-6"
          placeholder="Section Title"
        />
      ) : (
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`group relative rounded-lg overflow-hidden border ${
              isEditing ? "border-dashed border-gray-300" : "border-gray-200"
            }`}
          >
            {/* Project Image */}
            <div className="aspect-video bg-gray-100 relative">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                </div>
              )}

              {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <input
                    type="url"
                    value={project.imageUrl || ""}
                    onChange={(e) =>
                      handleProjectChange(project.id, "imageUrl", e.target.value || null)
                    }
                    className="bg-white px-2 py-1 rounded text-sm w-3/4"
                    placeholder="Image URL"
                  />
                </div>
              )}
            </div>

            {/* Project Content */}
            <div className="p-4">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => handleProjectChange(project.id, "title", e.target.value)}
                    className="font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full mb-2"
                    placeholder="Project Title"
                  />
                  <textarea
                    value={project.description}
                    onChange={(e) =>
                      handleProjectChange(project.id, "description", e.target.value)
                    }
                    className="text-sm text-gray-600 bg-transparent border border-gray-300 focus:border-blue-500 focus:outline-none w-full p-1 rounded resize-none"
                    placeholder="Description"
                    rows={2}
                  />
                  <input
                    type="url"
                    value={project.url || ""}
                    onChange={(e) =>
                      handleProjectChange(project.id, "url", e.target.value || null)
                    }
                    className="mt-2 text-sm bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                    placeholder="Project URL (optional)"
                  />
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-gray-900">{project.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm mt-2 hover:underline"
                      style={{ color: primaryColor }}
                    >
                      View Project <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </>
              )}
            </div>

            {isEditing && (
              <button
                onClick={() => removeProject(project.id)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        {isEditing && (
          <button
            onClick={addProject}
            className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
          >
            <Plus className="w-8 h-8 mb-2" />
            Add Project
          </button>
        )}
      </div>
    </div>
  )
}
