"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { agentApi } from "@/lib/api-client"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import WalletConnector from "@/components/wallet-connector"
import { CheckCircle2, Circle, ChevronRight, Eye, Code2, Play } from "lucide-react"
import { AgentIdentity } from "@/components/builder/agent-identity"
import { CapabilitiesPanel } from "@/components/builder/capabilities-panel"
import { DataSourcesPanel } from "@/components/builder/data-sources-panel"
import { IntegrationsPanel } from "@/components/builder/integrations-panel"
import { RulesPanel } from "@/components/builder/rules-panel"
import { PreviewPanel } from "@/components/builder/preview-panel"
import RAGSources from "@/components/builder/rag-sources"
import AgentPolicies from "@/components/builder/agent-policies"
import Scheduler from "@/components/builder/scheduler"
import ExposureRules from "@/components/builder/exposure-rules"
import BYOKeys from "@/components/builder/byo-keys"
import Animated from "@/components/Animated"
import AmbientBackground from "@/components/ambient"
import { motion } from "framer-motion"

const BUILDER_SECTIONS = [
  {
    id: "identity",
    label: "Identity & Profile",
    icon: "👤",
    description: "Define your agent's name, personality, and core identity",
    badge: "BASIC",
  },
  {
    id: "capabilities",
    label: "Capabilities",
    icon: "⚡",
    description: "Enable and configure agent capabilities and actions",
    badge: "FEATURES",
  },
  {
    id: "data",
    label: "Data Sources",
    icon: "📊",
    description: "Connect knowledge bases, APIs, and data sources",
    badge: "INTEGRATION",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: "🔗",
    description: "Connect external tools and platforms",
    badge: "INTEGRATION",
  },
  {
    id: "rules",
    label: "Rules & Constraints",
    icon: "⚙️",
    description: "Set safety rules, rate limits, and validation",
    badge: "SAFETY",
  },
  {
    id: "monetization",
    label: "Monetization",
    icon: "💰",
    description: "Configure pricing and revenue models",
    badge: "BUSINESS",
  },
  {
    id: "testing",
    label: "Testing & Deploy",
    icon: "🚀",
    description: "Test, preview, and deploy your agent",
    badge: "DEPLOYMENT",
  },
]

export default function BuilderPage() {
  const router = useRouter()
  const [registering, setRegistering] = useState(false)
  const [registeredInfo, setRegisteredInfo] = useState<any | null>(null)
  const [activeSection, setActiveSection] = useState("identity")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  type AgentData = {
    name: string
    tagline: string
    description: string
    type: string
    personality: string[]
    visibility: "private" | "public"
  }

  const [agentData, setAgentData] = useState<AgentData>({
    name: "My Agent",
    tagline: "",
    description: "",
    type: "Trading Agent",
    personality: [],
    visibility: "private",
  })
  const [completedSections, setCompletedSections] = useState<string[]>([])

  const handleSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId])
    }
  }

  const currentSectionIndex = BUILDER_SECTIONS.findIndex((s) => s.id === activeSection)
  const progressPercentage = (completedSections.length / BUILDER_SECTIONS.length) * 100
  const isIdentityComplete = agentData.name && agentData.description

  const goToNext = () => {
    if (currentSectionIndex < BUILDER_SECTIONS.length - 1) {
      setActiveSection(BUILDER_SECTIONS[currentSectionIndex + 1].id)
    }
  }

  const goToPrevious = () => {
    if (currentSectionIndex > 0) {
      setActiveSection(BUILDER_SECTIONS[currentSectionIndex - 1].id)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      setShowCommandPalette(!showCommandPalette)
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault()
      // Auto-save functionality
    }
    if (e.key === "ArrowRight" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      goToNext()
    }
    if (e.key === "ArrowLeft" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      goToPrevious()
    }
  }

  return (
    <div className="relative flex h-screen bg-[#030014]">
      <AmbientBackground />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64" onKeyDown={handleKeyDown}>
        <DashboardHeader />
        <Animated className="flex-1 overflow-hidden flex">
          <div className="w-72 border-r border-border bg-slate-50 dark:bg-slate-900/50 overflow-y-auto">
            <div className="sticky top-0 bg-slate-50 dark:bg-slate-900/50 border-b border-border p-4 z-10">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Agent Builder</h1>
                <div className="text-xs font-medium text-primary">{Math.round(progressPercentage)}%</div>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary rounded-full h-1.5 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 space-y-2">
              {BUILDER_SECTIONS.map((section, index) => {
                const isActive = activeSection === section.id
                const isCompleted = completedSections.includes(section.id)

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left group relative transition-all duration-200 ${
                      isActive
                        ? "bg-white dark:bg-slate-800 shadow-sm border-l-2 border-primary"
                        : "hover:bg-white/50 dark:hover:bg-slate-800/50 border-l-2 border-transparent"
                    }`}
                  >
                    <div className="px-3 py-3">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">{section.icon}</span>
                            <span className={`text-sm font-semibold truncate ${isActive ? "text-foreground" : ""}`}>
                              {section.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 leading-tight">
                            {section.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-mono uppercase tracking-wide">
                              {section.badge}
                            </span>
                            <span className="text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                          </div>
                        </div>

                        {isActive && <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="border-t border-border p-4 mt-4 space-y-2 bg-slate-50/50 dark:bg-slate-900/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Shortcuts</p>
                          <div className="mt-4">
                            <div className="flex items-center gap-3 text-xs">
                              <div className="px-2 py-1 rounded bg-muted/30 text-muted-foreground">Mode:</div>
                              <div className="font-mono text-sm">Mock Backend</div>
                              <div className="ml-3 text-xs text-muted-foreground">{registeredInfo ? `Registered: ${String(registeredInfo.agent_id ?? registeredInfo.contractAddress ?? registeredInfo.tokenId)}` : "Not registered"}</div>
                            </div>

                            {registeredInfo && (
                              <div className="mt-3 p-3 rounded bg-primary/5 border border-primary/10 text-sm">
                                <div className="font-medium">Agent registered (mock)</div>
                                <div className="mt-1 font-mono text-xs">ID: {registeredInfo.agent_id || registeredInfo.contractAddress || registeredInfo.tokenId}</div>
                                {registeredInfo.explorer_url && (
                                  <div className="mt-2">
                                    <a href={registeredInfo.explorer_url} target="_blank" rel="noreferrer" className="text-primary">
                                      View on explorer
                                    </a>
                                    <a href={`/dashboard/marketplace/${registeredInfo.contract_address ?? registeredInfo.contractAddress}`} className="ml-4 text-sm">
                                      View listing
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
            <div className="flex h-full">
              {/* Main Panel */}
              <div className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <div className="mb-8 pb-6 border-b border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
            </div>
          </div>

          <div className="flex h-full">
                        <h2 className="text-3xl font-bold text-white">
                          {BUILDER_SECTIONS[currentSectionIndex].label}
                        </h2>
                      </div>

                      <p className="text-gray-400">{BUILDER_SECTIONS[currentSectionIndex].description}</p>

                      {/* Network & registration banner */}
                        <div className="mt-4">
                          <div className="flex items-center gap-3 text-xs">
                            <div className="px-2 py-1 rounded bg-gray-800 text-gray-400">Mode:</div>
                            <div className="font-mono text-sm text-white">Mock Backend</div>
                            <div className="ml-3 text-xs text-gray-400">{registeredInfo ? `Registered: ${String(registeredInfo.agent_id ?? registeredInfo.contractAddress ?? registeredInfo.tokenId)}` : "Not registered"}</div>
                          </div>

                          {registeredInfo && (
                            <div className="mt-3 p-3 rounded bg-violet-500/10 border border-violet-500/20 text-sm">
                              <div className="font-medium text-white">Agent registered (mock)</div>
                              <div className="mt-1 font-mono text-xs text-gray-400">ID: {registeredInfo.agent_id || registeredInfo.contractAddress || registeredInfo.tokenId}</div>
                              {registeredInfo.explorer_url && (
                                <div className="mt-2">
                                  <a href={registeredInfo.explorer_url} target="_blank" rel="noreferrer" className="text-violet-400 hover:text-violet-300">
                                    View on explorer
                                  </a>
                                  <a href={`/dashboard/marketplace/${registeredInfo.contract_address ?? registeredInfo.contractAddress}`} className="ml-4 text-sm text-violet-400 hover:text-violet-300">
                                    View listing
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="hidden md:block">
                        <WalletConnector />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            // noop preview action
                          }}
                          className="p-2 hover:bg-gray-800 rounded-md transition"
                        >
                          <Eye className="w-5 h-5 text-gray-400 hover:text-white" />
                        </button>
                        <button className="p-2 hover:bg-gray-800 rounded-md transition">
                          <Code2 className="w-5 h-5 text-gray-400 hover:text-white" />
                        </button>

                        <div className="ml-3">
                          <button
                            onClick={async () => {
                              // Register Agent (mock backend flow)
                              setRegistering(true)
                              setRegisteredInfo(null)
                              try {
                                // Create agent
                                const createRes: any = await agentApi.create({
                                  name: agentData.name,
                                  description: agentData.description,
                                  personality: agentData.personality,
                                  capabilities: [],
                                  data_sources: [],
                                  rules: {},
                                  visibility: agentData.visibility,
                                  pricing: null,
                                })

                                const agentId = createRes.agent_id

                                // Register on mock chain via backend
                                const regRes: any = await agentApi.register(agentId)
                                // regRes contains tx_hash, explorer_url, etc.
                                const combined = { ...regRes, agent_id: agentId }
                                setRegisteredInfo(combined)

                                // Persist as a local listing placeholder
                                try {
                                  const key = "phantom.seller.listings"
                                  const existing = JSON.parse(localStorage.getItem(key) || "[]")
                                  existing.push({ id: combined.contractAddress || combined.agent_id || `local-${Date.now()}`, agentData, onChain: combined })
                                  localStorage.setItem(key, JSON.stringify(existing))
                                } catch (e) {
                                  console.warn("local persist failed", e)
                                }
                              } catch (err) {
                                console.error(err)
                                alert("Failed to register agent: " + String(err))
                              } finally {
                                setRegistering(false)
                              }
                            }}
                            disabled={registering}
                            className="px-3 py-1 bg-violet-600 text-white rounded-md text-sm hover:bg-violet-700 transition"
                          >
                            {registering ? "Registering…" : "Register Agent"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="max-w-3xl mb-8">
                  {activeSection === "identity" && (
                    <AgentIdentity
                      data={agentData}
                      onChange={setAgentData}
                      onComplete={() => handleSectionComplete("identity")}
                    />
                  )}
                  {activeSection === "capabilities" && (
                    <CapabilitiesPanel onComplete={() => handleSectionComplete("capabilities")} />
                  )}
                  {activeSection === "data" && (
                    <div className="space-y-6">
                      <DataSourcesPanel onComplete={() => handleSectionComplete("data")} />
                      <div className="mt-4">
                        <BYOKeys agentName={agentData.name} />
                      </div>
                      <div className="mt-4">
                        <RAGSources agentName={agentData.name} />
                      </div>
                    </div>
                  )}
                  {activeSection === "integrations" && (
                    <IntegrationsPanel onComplete={() => handleSectionComplete("integrations")} />
                  )}
                  {activeSection === "rules" && (
                    <div className="space-y-6">
                      <RulesPanel onComplete={() => handleSectionComplete("rules")} />
                      <div className="mt-4 space-y-4">
                        <AgentPolicies agentName={agentData.name} />
                        <ExposureRules agentName={agentData.name} />
                      </div>
                    </div>
                  )}
                  {activeSection === "monetization" && (
                    <div className="space-y-6">
                      <div className="border border-border rounded-lg p-6 bg-card">
                        <h3 className="font-semibold mb-4 text-lg">Pricing Strategy</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium block mb-2">Model</label>
                            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                              <option>Free</option>
                              <option>One-time Rental</option>
                              <option>Subscription</option>
                              <option>Usage-based</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium block mb-2">Price (USD)</label>
                            <input
                              type="number"
                              placeholder="0.00"
                              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSectionComplete("monetization")}
                        className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium"
                      >
                        Save & Continue
                      </button>
                    </div>
                  )}
                  {activeSection === "testing" && (
                    <div className="space-y-6">
                      <div className="border border-border rounded-lg p-6 bg-card">
                        <h3 className="font-semibold mb-4 text-lg">Dry Run Test</h3>
                        <textarea
                          placeholder="Enter test input..."
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                          rows={4}
                        ></textarea>
                        <button className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium flex items-center justify-center gap-2">
                          <Play className="w-4 h-4" />
                          Run Test
                        </button>
                      </div>
                      <div className="border border-border rounded-lg p-6 bg-card">
                        <Scheduler agentName={agentData.name} />
                      </div>
                      <div className="border border-border rounded-lg p-6 bg-card">
                        <h3 className="font-semibold mb-4 text-lg">Deployment</h3>
                        <p className="text-sm text-muted-foreground mb-4">Ready to deploy your agent to production</p>
                        <button className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium">
                          Deploy Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <button
                    onClick={goToPrevious}
                    disabled={currentSectionIndex === 0}
                    className="px-4 py-2 text-sm font-medium rounded-md border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{String(currentSectionIndex + 1).padStart(2, "0")}</span>
                    <span>/</span>
                    <span className="font-mono">{String(BUILDER_SECTIONS.length).padStart(2, "0")}</span>
                  </div>

                  <button
                    onClick={goToNext}
                    disabled={currentSectionIndex === BUILDER_SECTIONS.length - 1}
                    className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="w-96 border-l border-border bg-slate-50 dark:bg-slate-900/50 overflow-y-auto">
                <div className="sticky top-0 bg-slate-50 dark:bg-slate-900/50 border-b border-border p-4 z-10">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Live Preview
                  </h3>
                </div>
                <PreviewPanel agentName={agentData.name} agentType={agentData.type} />
              </div>
            </div>
          </div>
        </Animated>
      </div>
    </div>
  )
}
