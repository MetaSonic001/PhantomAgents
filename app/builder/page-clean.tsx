"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { agentApi } from "@/lib/api-client"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { CheckCircle2, Circle, ChevronRight, Eye, Code2, Play } from "lucide-react"
import { AgentIdentity } from "@/components/builder/agent-identity"
import { CapabilitiesPanel } from "@/components/builder/capabilities-panel"
import { DataSourcesPanel } from "@/components/builder/data-sources-panel"
import { IntegrationsPanel } from "@/components/builder/integrations-panel"
import { RulesPanel } from "@/components/builder/rules-panel"
import RAGSources from "@/components/builder/rag-sources"
import AgentPolicies from "@/components/builder/agent-policies"
import Scheduler from "@/components/builder/scheduler"
import ExposureRules from "@/components/builder/exposure-rules"
import BYOKeys from "@/components/builder/byo-keys"
import Animated from "@/components/Animated"
import AmbientBackground from "@/components/ambient"

const BUILDER_SECTIONS = [
  { id: "identity", label: "Identity & Profile", icon: "👤", description: "Define your agent's name, personality, and core identity", badge: "BASIC" },
  { id: "capabilities", label: "Capabilities", icon: "⚡", description: "Enable and configure agent capabilities and actions", badge: "FEATURES" },
  { id: "data", label: "Data Sources", icon: "📊", description: "Connect knowledge bases, APIs, and data sources", badge: "INTEGRATION" },
  { id: "integrations", label: "Integrations", icon: "🔗", description: "Connect external tools and platforms", badge: "INTEGRATION" },
  { id: "rules", label: "Rules & Constraints", icon: "⚙️", description: "Set safety rules, rate limits, and validation", badge: "SAFETY" },
  { id: "monetization", label: "Monetization", icon: "💰", description: "Configure pricing and revenue models", badge: "BUSINESS" },
  { id: "testing", label: "Testing & Deploy", icon: "🚀", description: "Test, preview, and deploy your agent", badge: "DEPLOYMENT" },
]

type AgentData = {
  name: string
  tagline: string
  description: string
  type: string
  personality: string[]
  visibility: "private" | "public"
}

export default function BuilderPage() {
  const router = useRouter()
  const [registering, setRegistering] = useState(false)
  const [registeredInfo, setRegisteredInfo] = useState<any | null>(null)
  const [activeSection, setActiveSection] = useState("identity")
  
  const [agentData, setAgentData] = useState<AgentData>({
    name: "My Trading Agent",
    tagline: "Automated crypto trading with ZK privacy",
    description: "An intelligent trading agent that executes strategies while keeping your methods private and verifiable on-chain.",
    type: "Trading Agent",
    personality: ["Analytical", "Risk-aware", "Data-driven"],
    visibility: "private",
  })
  const [completedSections, setCompletedSections] = useState<string[]>(["identity"])

  const handleSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId])
    }
  }

  const currentSectionIndex = BUILDER_SECTIONS.findIndex((s) => s.id === activeSection)
  const progressPercentage = (completedSections.length / BUILDER_SECTIONS.length) * 100

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
    <div className="relative flex h-screen bg-background">
      <AmbientBackground />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64" onKeyDown={handleKeyDown}>
        <DashboardHeader />
        <Animated className="flex-1 overflow-hidden flex">
          {/* Builder Steps Sidebar */}
          <div className="w-80 border-r border-border bg-card overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Agent Builder</h1>
                <div className="text-xs font-medium text-primary">{Math.round(progressPercentage)}%</div>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary rounded-full h-1.5 transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>

            <div className="p-4 space-y-2">
              {BUILDER_SECTIONS.map((section, index) => {
                const isActive = activeSection === section.id
                const isCompleted = completedSections.includes(section.id)
                const activeClasses = isActive ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary border border-transparent"

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left group relative transition-all duration-200 rounded-lg ${activeClasses}`}
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
                            <span className={`text-sm font-semibold truncate ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                              {section.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-tight">
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

            <div className="border-t border-border p-4 mt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Info</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="px-2 py-1 rounded bg-muted text-muted-foreground">Mode:</div>
                  <div className="font-mono text-sm text-foreground">Mock Backend</div>
                </div>
                {registeredInfo && (
                  <div className="mt-3 p-3 rounded bg-primary/5 border border-primary/10 text-sm">
                    <div className="font-medium text-foreground">✅ Agent Registered</div>
                    <div className="mt-1 font-mono text-xs text-muted-foreground truncate">
                      ID: {registeredInfo.agent_id || registeredInfo.contractAddress}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="border-b border-border bg-card px-8 py-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{BUILDER_SECTIONS[currentSectionIndex].icon}</span>
                    <h2 className="text-2xl font-bold text-foreground">
                      {BUILDER_SECTIONS[currentSectionIndex].label}
                    </h2>
                  </div>
                  <p className="text-muted-foreground">{BUILDER_SECTIONS[currentSectionIndex].description}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <button className="p-2 hover:bg-secondary rounded-md transition" title="Preview">
                    <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                  </button>
                  <button className="p-2 hover:bg-secondary rounded-md transition" title="View Code">
                    <Code2 className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                  </button>
                  <button
                    onClick={async () => {
                      setRegistering(true)
                      setRegisteredInfo(null)
                      try {
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
                        const regRes: any = await agentApi.register(createRes.agent_id)
                        setRegisteredInfo({ ...regRes, agent_id: createRes.agent_id })
                      } catch (err) {
                        console.error(err)
                        alert("Failed to register agent: " + String(err))
                      } finally {
                        setRegistering(false)
                      }
                    }}
                    disabled={registering}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition disabled:opacity-50"
                  >
                    {registering ? "Registering..." : "Register Agent"}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-5xl mx-auto p-8">
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
                          <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm">
                            <option>Free</option>
                            <option>One-time Rental</option>
                            <option>Subscription</option>
                            <option>Usage-based</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-2">Price (USD)</label>
                          <input type="number" placeholder="0.00" className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm" />
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleSectionComplete("monetization")} className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium">
                      Save & Continue
                    </button>
                  </div>
                )}
                {activeSection === "testing" && (
                  <div className="space-y-6">
                    <div className="border border-border rounded-lg p-6 bg-card">
                      <h3 className="font-semibold mb-4 text-lg">Dry Run Test</h3>
                      <textarea placeholder="Enter test input..." className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm mb-4" rows={4}></textarea>
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

                {/* Navigation Footer */}
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
                  <button
                    onClick={goToPrevious}
                    disabled={currentSectionIndex === 0}
                    className="px-6 py-2 text-sm font-medium rounded-md border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    ← Previous
                  </button>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-mono">{String(currentSectionIndex + 1).padStart(2, "0")}</span>
                    <span>/</span>
                    <span className="font-mono">{String(BUILDER_SECTIONS.length).padStart(2, "0")}</span>
                    <span className="ml-2">{BUILDER_SECTIONS[currentSectionIndex].label}</span>
                  </div>
                  <button
                    onClick={goToNext}
                    disabled={currentSectionIndex === BUILDER_SECTIONS.length - 1}
                    className="px-6 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Animated>
      </div>
    </div>
  )
}

