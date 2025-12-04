"use client"

import { useState } from "react"
import { Mic, Phone, Volume2, MessageSquare } from "lucide-react"

export default function VoiceAgentsPage() {
  const [voiceAgents] = useState([
    {
      id: 1,
      name: "Customer Service Bot",
      accent: "US English",
      tone: "Professional",
      pace: "Normal",
      gender: "Female",
      status: "active",
      calls: 234,
      avgDuration: "4:32",
    },
    {
      id: 2,
      name: "Sales Appointment Bot",
      accent: "UK English",
      tone: "Friendly",
      pace: "Moderate",
      gender: "Male",
      status: "active",
      calls: 156,
      avgDuration: "3:15",
    },
    {
      id: 3,
      name: "Support Escalation",
      accent: "Neutral",
      tone: "Empathetic",
      pace: "Slow",
      gender: "Female",
      status: "idle",
      calls: 89,
      avgDuration: "2:45",
    },
  ])

  const [voicePersonality, setVoicePersonality] = useState({
    accent: "US English",
    tone: "Professional",
    pace: "Normal",
    gender: "Female",
    emotionDetection: true,
    interruptionHandling: true,
  })

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Voice Agents & Telephony</h1>
        <p className="text-gray-400">Create AI agents with natural voice interactions and phone integration</p>
      </div>

      {/* Voice Personality Designer */}
      <div className="border border-gray-800 rounded-lg bg-linear-to-br from-gray-900/50 to-gray-800/30 p-6 backdrop-blur-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
          <Volume2 className="w-5 h-5 text-gray-300" />
          Voice Personality Designer
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Accent</label>
              <select
                value={voicePersonality.accent}
                onChange={(e) => setVoicePersonality({ ...voicePersonality, accent: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option>US English</option>
                <option>UK English</option>
                <option>Australian</option>
                <option>Canadian</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Tone</label>
              <select
                value={voicePersonality.tone}
                onChange={(e) => setVoicePersonality({ ...voicePersonality, tone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option>Professional</option>
                <option>Friendly</option>
                <option>Empathetic</option>
                <option>Formal</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Pace</label>
              <select
                value={voicePersonality.pace}
                onChange={(e) => setVoicePersonality({ ...voicePersonality, pace: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option>Slow</option>
                <option>Moderate</option>
                <option>Normal</option>
                <option>Fast</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Gender</label>
              <select
                value={voicePersonality.gender}
                onChange={(e) => setVoicePersonality({ ...voicePersonality, gender: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option>Female</option>
                <option>Male</option>
                <option>Neutral</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800/30 p-4 rounded-lg text-center">
              <Mic className="w-12 h-12 mx-auto mb-3 text-violet-400" />
              <p className="font-semibold mb-2 text-white">Voice Preview</p>
              <button className="px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition font-medium mb-3">
                Play Sample
              </button>
              <p className="text-xs text-gray-400">
                {voicePersonality.accent} • {voicePersonality.tone} • {voicePersonality.pace}
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={voicePersonality.emotionDetection}
                  onChange={(e) => setVoicePersonality({ ...voicePersonality, emotionDetection: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Enable Emotion Detection</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={voicePersonality.interruptionHandling}
                  onChange={(e) => setVoicePersonality({ ...voicePersonality, interruptionHandling: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Enable Interruption Handling</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Agents */}
      <div className="border border-gray-800 rounded-lg bg-linear-to-br from-gray-900/50 to-gray-800/30 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
          <Phone className="w-5 h-5 text-gray-300" />
          Active Voice Agents
        </h2>

        <div className="space-y-4">
          {voiceAgents.map((agent) => (
            <div key={agent.id} className="border border-gray-800 rounded-lg p-4 hover:border-violet-500/30 transition bg-gray-900/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{agent.name}</h3>
                  <p className="text-xs text-gray-400">
                    {agent.accent} • {agent.tone} • {agent.gender}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    agent.status === "active" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  ● {agent.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                <div className="bg-gray-800/30 p-2 rounded">
                  <p className="text-xs text-gray-400">Calls Made</p>
                  <p className="font-semibold text-white">{agent.calls}</p>
                </div>
                <div className="bg-gray-800/30 p-2 rounded">
                  <p className="text-xs text-gray-400">Avg Duration</p>
                  <p className="font-semibold text-white">{agent.avgDuration}</p>
                </div>
                <div className="bg-gray-800/30 p-2 rounded">
                  <p className="text-xs text-gray-400">Pace</p>
                  <p className="font-semibold text-white">{agent.pace}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 border border-gray-700 rounded-md hover:bg-gray-800 transition text-sm font-medium text-gray-300">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Call Log
                </button>
                <button className="flex-1 px-3 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition text-sm font-medium">
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IVR Builder */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          IVR Phone Tree Builder
        </h2>

        <div className="bg-secondary/20 p-6 rounded-lg text-center">
          <div className="inline-block">
            <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold mb-3">
              Welcome Call
            </div>
          </div>
          <div className="flex justify-center mb-3">
            <div className="w-1 h-12 bg-border"></div>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <div className="bg-card border border-border px-4 py-2 rounded">Press 1: Sales</div>
            <div className="bg-card border border-border px-4 py-2 rounded">Press 2: Support</div>
            <div className="bg-card border border-border px-4 py-2 rounded">Press 3: Billing</div>
          </div>
        </div>

        <button className="mt-6 w-full px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium">
          Build IVR Tree
        </button>
      </div>
    </div>
  )
}
