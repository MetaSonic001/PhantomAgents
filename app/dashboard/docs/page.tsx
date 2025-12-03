"use client"

import { BookOpen, Code2, ExternalLink } from "lucide-react"

export default function DocsPage() {
  const docSections = [
    {
      title: "Getting Started",
      items: [
        { name: "Quick Start Guide", icon: "📖" },
        { name: "Create Your First Agent", icon: "🤖" },
        { name: "Deploy to Production", icon: "🚀" },
      ],
    },
    {
      title: "API Reference",
      items: [
        { name: "Authentication", icon: "🔐" },
        { name: "Agents API", icon: "📡" },
        { name: "Webhooks", icon: "🪝" },
        { name: "Rate Limits", icon: "⚡" },
      ],
    },
    {
      title: "Advanced Topics",
      items: [
        { name: "Custom Code Execution", icon: "💻" },
        { name: "Data Integrations", icon: "🔗" },
        { name: "Security & Compliance", icon: "🔒" },
        { name: "Performance Optimization", icon: "⚙️" },
      ],
    },
  ]

  const codeExamples = [
    {
      title: "Create an Agent",
      language: "Python",
      code: `from phantom_agents import Agent

agent = Agent(
  name="Trading Bot",
  capabilities=["trading", "analysis"],
  model="gpt-4"
)

agent.deploy()`,
    },
    {
      title: "Call Agent API",
      language: "cURL",
      code: `curl -X POST https://api.phantom.ai/v1/agents/123/run \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"action": "analyze", "data": {...}}'`,
    },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">Complete guides and API reference for PhantomAgents</p>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="border border-border rounded-lg p-4 bg-card hover:border-accent transition cursor-pointer">
          <BookOpen className="w-6 h-6 mb-2" />
          <p className="font-semibold text-sm">Guides</p>
          <p className="text-xs text-muted-foreground">Step-by-step tutorials</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card hover:border-accent transition cursor-pointer">
          <Code2 className="w-6 h-6 mb-2" />
          <p className="font-semibold text-sm">API</p>
          <p className="text-xs text-muted-foreground">REST endpoints</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card hover:border-accent transition cursor-pointer">
          <ExternalLink className="w-6 h-6 mb-2" />
          <p className="font-semibold text-sm">Community</p>
          <p className="text-xs text-muted-foreground">Forum & Discord</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card hover:border-accent transition cursor-pointer">
          <BookOpen className="w-6 h-6 mb-2" />
          <p className="font-semibold text-sm">FAQ</p>
          <p className="text-xs text-muted-foreground">Common questions</p>
        </div>
      </div>

      {/* Documentation Sections */}
      <div className="grid md:grid-cols-3 gap-6">
        {docSections.map((section, idx) => (
          <div key={idx} className="border border-border rounded-lg bg-card p-6">
            <h2 className="font-semibold text-lg mb-4">{section.title}</h2>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 p-2 rounded hover:bg-secondary transition cursor-pointer"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Code Examples */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h2 className="text-xl font-bold mb-6">Code Examples</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {codeExamples.map((example, idx) => (
            <div key={idx} className="border border-border rounded-lg overflow-hidden">
              <div className="bg-secondary/50 px-4 py-2 border-b border-border flex justify-between items-center">
                <p className="font-semibold text-sm">{example.title}</p>
                <span className="text-xs text-muted-foreground">{example.language}</span>
              </div>
              <pre className="p-4 text-xs overflow-x-auto bg-background">
                <code className="font-mono">{example.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
