"use client"

import { useState } from "react"
import { Send, RotateCcw, Download, Share2, FileJson, Cpu, MessageSquare, Clock, Code2 } from "lucide-react"

export default function PlaygroundPage() {
  const [messages, setMessages] = useState([
    { id: 1, role: "user", content: "What are the current market trends?" },
    {
      id: 2,
      role: "agent",
      content:
        "Analyzing market data from multiple sources...\n\nCurrent trends:\n- Tech sector up 2.3%\n- Crypto market stable\n- Bonds rallying\n\nRisk assessment: MEDIUM",
    },
  ])
  const [input, setInput] = useState("")
  const [memoryState, setMemoryState] = useState({
    user_id: "user_123",
    last_query: "market trends",
    session_start: "2025-12-03T10:30:00Z",
    context_window: 2048,
  })
  const [stepHistory, setStepHistory] = useState([
    { step: 1, action: "Input Validation", status: "complete", time: "0ms" },
    { step: 2, action: "Data Retrieval", status: "complete", time: "245ms" },
    { step: 3, action: "Analysis", status: "complete", time: "892ms" },
    { step: 4, action: "Response Generation", status: "complete", time: "156ms" },
  ])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([
      ...messages,
      { id: messages.length + 1, role: "user", content: input },
      {
        id: messages.length + 2,
        role: "agent",
        content: "Processing your request...\n\n[Analysis in progress]\n\nResponse generated successfully.",
      },
    ])
    setInput("")
  }

  const mockApiResponses = [
    { endpoint: "GET /market/prices", response: '{"BTC": 45230, "ETH": 2450}', status: "200" },
    { endpoint: "GET /sentiment/analysis", response: '{"score": 0.73, "label": "bullish"}', status: "200" },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Agent Playground</h1>
        <p className="text-muted-foreground">Interactive testing environment for your agents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2 border border-border rounded-lg bg-card flex flex-col h-[600px]">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <span className="font-semibold">Chat with Agent</span>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-secondary rounded-md transition" title="Reset">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground border border-border"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask the agent something..."
              className="flex-1 px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Side Panels */}
        <div className="space-y-4">
          {/* Memory Inspector */}
          <div className="border border-border rounded-lg bg-card p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Memory State
            </h3>
            <div className="space-y-3 text-xs">
              {Object.entries(memoryState).map(([key, value]) => (
                <div key={key} className="bg-secondary/50 p-2 rounded">
                  <p className="text-muted-foreground">{key}</p>
                  <p className="font-mono text-xs break-all">{JSON.stringify(value)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium text-sm flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Export Conversation
            </button>
            <button className="w-full px-4 py-2 border border-border rounded-md hover:bg-secondary transition font-medium text-sm flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Session
            </button>
          </div>
        </div>
      </div>

      {/* Step Debugger */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Code2 className="w-5 h-5" />
          Step Debugger
        </h3>
        <div className="space-y-2">
          {stepHistory.map((step, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                  {step.step}
                </div>
                <span className="text-sm font-medium">{step.action}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-1 bg-green-500/10 text-green-700 rounded">
                  {step.status === "complete" ? "✓" : "•"} {step.status}
                </span>
                <span className="text-xs text-muted-foreground">{step.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Integrations */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FileJson className="w-5 h-5" />
          Mock API Responses
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {mockApiResponses.map((api, idx) => (
            <div key={idx} className="border border-border rounded-lg p-4 bg-secondary/20">
              <p className="text-xs font-mono text-primary mb-2">{api.endpoint}</p>
              <pre className="text-xs bg-background p-2 rounded border border-border overflow-x-auto">
                {api.response}
              </pre>
              <p className="text-xs text-muted-foreground mt-2">Status: {api.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Time Travel Controls */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Time Travel & Replay
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input type="range" min="0" max="100" className="flex-1" />
          </div>
          <p className="text-sm text-muted-foreground">Scrub through conversation history</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition font-medium text-sm">
              ⏮ Start
            </button>
            <button className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition font-medium text-sm">
              ⏪ Rewind
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium text-sm">
              ▶ Play
            </button>
            <button className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition font-medium text-sm">
              ⏩ Forward
            </button>
            <button className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition font-medium text-sm">
              ⏭ End
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
