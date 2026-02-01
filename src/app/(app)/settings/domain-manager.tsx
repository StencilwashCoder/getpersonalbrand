"use client"

import { useState } from "react"
import { Plus, Trash2, RefreshCw, CheckCircle, Clock, XCircle } from "lucide-react"

interface Domain {
  id: string
  domain: string
  status: string
  verifiedAt: Date | null
}

interface DomainManagerProps {
  siteId: string
  domains: Domain[]
}

const STATUS_CONFIG = {
  pending_verification: {
    icon: Clock,
    label: "Pending",
    color: "text-yellow-600 bg-yellow-100",
  },
  verified: {
    icon: CheckCircle,
    label: "Verified",
    color: "text-green-600 bg-green-100",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    color: "text-red-600 bg-red-100",
  },
}

export function DomainManager({ siteId, domains: initialDomains }: DomainManagerProps) {
  const [domains, setDomains] = useState<Domain[]>(initialDomains)
  const [newDomain, setNewDomain] = useState("")
  const [adding, setAdding] = useState(false)
  const [verifying, setVerifying] = useState<string | null>(null)
  const [showInstructions, setShowInstructions] = useState<string | null>(null)

  const addDomain = async () => {
    if (!newDomain.trim()) return

    setAdding(true)
    try {
      const response = await fetch("/api/domains/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, domain: newDomain.toLowerCase().trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setDomains((prev) => [...prev, data.domain])
        setNewDomain("")
        setShowInstructions(data.domain.id)
      } else {
        alert(data.error || "Failed to add domain")
      }
    } catch {
      alert("Failed to add domain")
    } finally {
      setAdding(false)
    }
  }

  const verifyDomain = async (domainId: string) => {
    setVerifying(domainId)
    try {
      const response = await fetch("/api/domains/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId }),
      })

      const data = await response.json()

      if (response.ok) {
        setDomains((prev) =>
          prev.map((d) => (d.id === domainId ? { ...d, status: data.status } : d))
        )
      }
    } catch {
      // Silently fail
    } finally {
      setVerifying(null)
    }
  }

  const removeDomain = async (domainId: string) => {
    if (!confirm("Are you sure you want to remove this domain?")) return

    try {
      const response = await fetch("/api/domains/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId }),
      })

      if (response.ok) {
        setDomains((prev) => prev.filter((d) => d.id !== domainId))
      }
    } catch {
      alert("Failed to remove domain")
    }
  }

  return (
    <div>
      {/* Existing Domains */}
      {domains.length > 0 && (
        <div className="space-y-3 mb-6">
          {domains.map((domain) => {
            const config = STATUS_CONFIG[domain.status as keyof typeof STATUS_CONFIG] ||
              STATUS_CONFIG.pending_verification
            const StatusIcon = config.icon

            return (
              <div key={domain.id}>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{domain.domain}</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${config.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {domain.status === "pending_verification" && (
                      <>
                        <button
                          onClick={() =>
                            setShowInstructions(
                              showInstructions === domain.id ? null : domain.id
                            )
                          }
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          View DNS Instructions
                        </button>
                        <button
                          onClick={() => verifyDomain(domain.id)}
                          disabled={verifying === domain.id}
                          className="p-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        >
                          <RefreshCw
                            className={`w-4 h-4 ${
                              verifying === domain.id ? "animate-spin" : ""
                            }`}
                          />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => removeDomain(domain.id)}
                      className="p-1.5 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {showInstructions === domain.id && (
                  <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">
                      DNS Configuration
                    </h4>
                    <p className="text-sm text-blue-800 mb-3">
                      Add this CNAME record to your domain&apos;s DNS settings:
                    </p>
                    <div className="bg-white p-3 rounded font-mono text-sm">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Type</div>
                          <div>CNAME</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Name</div>
                          <div>@</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Value</div>
                          <div>cname.getpersonalbrand.com</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-blue-700 mt-3">
                      DNS changes can take up to 48 hours to propagate. Click the
                      refresh icon to check verification status.
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add Domain */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          placeholder="yourdomain.com"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={addDomain}
          disabled={adding || !newDomain.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          {adding ? "Adding..." : "Add Domain"}
        </button>
      </div>
    </div>
  )
}
