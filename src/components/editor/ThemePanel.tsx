"use client"

import { SiteTheme } from "@/types/blocks"

interface ThemePanelProps {
  theme: SiteTheme
  onUpdate: (theme: SiteTheme) => void
}

const COLOR_PRESETS = [
  { label: "Blue", value: "#2563eb" },
  { label: "Purple", value: "#7c3aed" },
  { label: "Pink", value: "#db2777" },
  { label: "Red", value: "#dc2626" },
  { label: "Orange", value: "#ea580c" },
  { label: "Green", value: "#16a34a" },
  { label: "Teal", value: "#0d9488" },
  { label: "Gray", value: "#4b5563" },
]

const FONT_OPTIONS = [
  { label: "Inter (Modern)", value: "inter" },
  { label: "Georgia (Classic)", value: "georgia" },
  { label: "System UI", value: "system-ui" },
]

export function ThemePanel({ theme, onUpdate }: ThemePanelProps) {
  return (
    <div className="w-72 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="font-semibold text-gray-900 mb-4">Theme Settings</h3>

      {/* Primary Color */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Color
        </label>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color.value}
              onClick={() => onUpdate({ ...theme, primaryColor: color.value })}
              className={`w-full aspect-square rounded-lg border-2 transition-all ${
                theme.primaryColor === color.value
                  ? "border-gray-900 scale-110"
                  : "border-transparent hover:border-gray-300"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.label}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) => onUpdate({ ...theme, primaryColor: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer"
          />
          <input
            type="text"
            value={theme.primaryColor}
            onChange={(e) => onUpdate({ ...theme, primaryColor: e.target.value })}
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Font */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Family
        </label>
        <select
          value={theme.font}
          onChange={(e) => onUpdate({ ...theme, font: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Template */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Template Style
        </label>
        <div className="space-y-2">
          {["modern", "bold", "classic"].map((template) => (
            <button
              key={template}
              onClick={() => onUpdate({ ...theme, template })}
              className={`w-full px-3 py-2 text-left rounded-lg border transition-colors ${
                theme.template === template
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium capitalize">{template}</div>
              <div className="text-xs text-gray-500">
                {template === "modern" && "Clean, minimal design"}
                {template === "bold" && "Strong typography, dark accents"}
                {template === "classic" && "Traditional professional look"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
