"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TEMPLATES, cloneTemplateBlocks, Template } from "@/lib/templates"
import { Check, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"

type Step = "template" | "profile" | "links" | "complete"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("template")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [profile, setProfile] = useState({
    name: "",
    headline: "",
    bio: "",
  })
  const [links, setLinks] = useState([
    { label: "Twitter", url: "", icon: "twitter" },
    { label: "LinkedIn", url: "", icon: "linkedin" },
  ])
  const [saving, setSaving] = useState(false)

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
  }

  const handleNext = () => {
    if (step === "template" && selectedTemplate) {
      setStep("profile")
    } else if (step === "profile") {
      setStep("links")
    } else if (step === "links") {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step === "profile") {
      setStep("template")
    } else if (step === "links") {
      setStep("profile")
    }
  }

  const handleComplete = async () => {
    if (!selectedTemplate) return

    setSaving(true)

    try {
      // Clone template blocks and update with user data
      const blocks = cloneTemplateBlocks(selectedTemplate.blocks)

      // Update hero block with profile data
      const heroBlock = blocks.find((b) => b.type === "hero")
      if (heroBlock && heroBlock.type === "hero") {
        heroBlock.data.name = profile.name || "Your Name"
        heroBlock.data.headline = profile.headline || "Your Headline"
        heroBlock.data.bio = profile.bio || "Tell your story here..."
      }

      // Update links block
      const linksBlock = blocks.find((b) => b.type === "links")
      if (linksBlock && linksBlock.type === "links") {
        linksBlock.data.links = links
          .filter((l) => l.url)
          .map((l, i) => ({
            id: `link-${i}`,
            ...l,
          }))
      }

      // Save to API
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blocks,
          theme: selectedTemplate.theme,
        }),
      })

      if (response.ok) {
        setStep("complete")
        setTimeout(() => {
          router.push("/editor")
        }, 2000)
      }
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleLinkChange = (index: number, field: string, value: string) => {
    setLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, [field]: value } : link))
    )
  }

  const addLink = () => {
    setLinks((prev) => [...prev, { label: "Website", url: "", icon: "website" }])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {["template", "profile", "links"].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s
                      ? "bg-blue-600 text-white"
                      : ["profile", "links", "complete"].indexOf(step) > i
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {["profile", "links", "complete"].indexOf(step) > i ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      ["profile", "links", "complete"].indexOf(step) > i
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {step === "template" && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Choose your template
              </h1>
              <p className="text-gray-600 mb-8">
                Pick a starting point. You can customize everything later.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedTemplate?.id === template.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className="w-full h-24 rounded-lg mb-3"
                      style={{ backgroundColor: template.theme.primaryColor + "20" }}
                    />
                    <div className="font-semibold text-gray-900">
                      {template.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!selectedTemplate}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {step === "profile" && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Tell us about yourself
              </h1>
              <p className="text-gray-600 mb-8">
                This will appear at the top of your site.
              </p>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={profile.headline}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, headline: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Designer, Developer, Creator"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, bio: e.target.value }))
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="A brief introduction about yourself..."
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {step === "links" && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Add your links
              </h1>
              <p className="text-gray-600 mb-8">
                Where can people find you online?
              </p>

              <div className="space-y-3 mb-6">
                {links.map((link, index) => (
                  <div key={index} className="flex gap-3">
                    <select
                      value={link.icon}
                      onChange={(e) =>
                        handleLinkChange(index, "icon", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="twitter">Twitter</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="github">GitHub</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="website">Website</option>
                      <option value="email">Email</option>
                    </select>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) =>
                        handleLinkChange(index, "label", e.target.value)
                      }
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Label"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) =>
                        handleLinkChange(index, "url", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="https://..."
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={addLink}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-8"
              >
                + Add another link
              </button>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    <>
                      Create My Site <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {step === "complete" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Your site is ready!
              </h1>
              <p className="text-gray-600">
                Redirecting you to the editor...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
