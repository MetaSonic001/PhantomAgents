"use client"

import { useState } from "react"
import { Shield, CheckCircle2, AlertTriangle, Award } from "lucide-react"

export default function TrustCenterPage() {
  const [agents] = useState([
    {
      id: 1,
      name: "Crypto Trader Pro",
      trustScore: 92,
      status: "Verified",
      audited: true,
      insured: true,
      badges: ["Audited", "Insured", "High-Reliability"],
      riskLevel: "Low",
      lastAudit: "2025-11-15",
      decisions: 2847,
      errorRate: 0.8,
    },
    {
      id: 2,
      name: "Market Oracle",
      trustScore: 87,
      status: "Verified",
      audited: true,
      insured: false,
      badges: ["Audited", "Performance-Tested"],
      riskLevel: "Low",
      lastAudit: "2025-10-20",
      decisions: 1923,
      errorRate: 1.2,
    },
    {
      id: 3,
      name: "New Research Bot",
      trustScore: 62,
      status: "Unverified",
      audited: false,
      insured: false,
      badges: [],
      riskLevel: "High",
      lastAudit: null,
      decisions: 145,
      errorRate: 3.5,
    },
  ])

  const auditDetails = {
    totalAudits: 342,
    passRate: 94.1,
    avgScore: 87.3,
    certifications: ["SOC 2 Type II", "ISO 27001", "GDPR Compliant"],
  }

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Trust Center</h1>
        <p className="text-gray-400">Verify agent reliability, audits, and security certifications</p>
      </div>

      {/* Trust Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-gray-800 rounded-lg p-4 bg-linear-to-br from-gray-900/50 to-gray-800/30">
          <p className="text-xs text-gray-400 mb-1">Total Audits</p>
          <p className="text-3xl font-bold text-white">{auditDetails.totalAudits}</p>
          <p className="text-xs text-green-500 mt-1">{auditDetails.passRate}% pass rate</p>
        </div>
        <div className="border border-gray-800 rounded-lg p-4 bg-linear-to-br from-gray-900/50 to-gray-800/30">
          <p className="text-xs text-gray-400 mb-1">Average Score</p>
          <p className="text-3xl font-bold text-white">{auditDetails.avgScore}</p>
          <p className="text-xs text-gray-400 mt-1">Out of 100</p>
        </div>
        <div className="border border-gray-800 rounded-lg p-4 bg-linear-to-br from-gray-900/50 to-gray-800/30">
          <p className="text-xs text-gray-400 mb-1">Insured Agents</p>
          <p className="text-3xl font-bold text-white">156</p>
          <p className="text-xs text-gray-400 mt-1">In pool</p>
        </div>
        <div className="border border-gray-800 rounded-lg p-4 bg-linear-to-br from-gray-900/50 to-gray-800/30">
          <p className="text-xs text-gray-400 mb-1">Insurance Pool</p>
          <p className="text-3xl font-bold text-white">$2.3M</p>
          <p className="text-xs text-green-500 mt-1">Available</p>
        </div>
      </div>

      {/* Certifications */}
      <div className="border border-gray-800 rounded-lg bg-linear-to-br from-gray-900/50 to-gray-800/30 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
          <Award className="w-5 h-5 text-violet-400" />
          Platform Certifications
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {auditDetails.certifications.map((cert, idx) => (
            <div key={idx} className="border border-gray-800 rounded-lg p-4 flex items-center gap-3 bg-gray-800/20">
              <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-white">{cert}</p>
                <p className="text-xs text-gray-400">Verified</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Trust Scores */}
      <div className="border border-gray-800 rounded-lg bg-linear-to-br from-gray-900/50 to-gray-800/30 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
          <Shield className="w-5 h-5 text-violet-400" />
          Agent Trust Scores
        </h2>
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.id} className="border border-gray-800 rounded-lg p-4 hover:border-violet-600/60 transition bg-gray-800/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white">{agent.name}</h3>
                  <p className="text-xs text-gray-400">{agent.decisions.toLocaleString()} decisions made</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{agent.trustScore}</p>
                  <p className="text-xs text-gray-400">Trust Score</p>
                </div>
              </div>

              <div className="w-full bg-gray-800/30 rounded-full h-2 mb-4">
                <div
                  className="bg-violet-500 h-full rounded-full transition-all"
                  style={{ width: `${agent.trustScore}%` }}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400">Risk Level</p>
                  <p
                    className={`text-sm font-semibold ${
                      agent.riskLevel === "Low"
                        ? "text-green-500"
                        : agent.riskLevel === "Medium"
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  >
                    {agent.riskLevel}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Error Rate</p>
                  <p className="text-sm font-semibold text-white">{agent.errorRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Audited</p>
                  <p className="text-sm font-semibold text-white">{agent.audited ? "✓ Yes" : "✗ No"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Insured</p>
                  <p className="text-sm font-semibold text-white">{agent.insured ? "✓ Yes" : "✗ No"}</p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap mb-4">
                {agent.badges.map((badge, idx) => (
                  <span key={idx} className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">
                    {badge}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 border border-gray-800 rounded-md hover:bg-gray-800/20 transition text-sm font-medium text-white">
                  View Audit
                </button>
                {!agent.insured && (
                  <button className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-500/90 transition text-sm font-medium">
                    Get Insurance
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Features */}
      <div className="border border-gray-800 rounded-lg bg-linear-to-br from-gray-900/50 to-gray-800/30 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Advanced Safety Features
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "Canary Testing",
              desc: "Test new versions on 1% traffic before rollout",
              status: "enabled",
            },
            {
              title: "Circuit Breakers",
              desc: "Auto-pause if error rate spikes above threshold",
              status: "enabled",
            },
            {
              title: "Rollback System",
              desc: "Undo any agent action within 24 hours",
              status: "enabled",
            },
            {
              title: "Explainable AI",
              desc: "Every decision shows complete reasoning chain",
              status: "enabled",
            },
          .map((feature, idx) => (
            <div key={idx} className="border border-gray-800 rounded-lg p-4 bg-gray-800/10">
              <h3 className="font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-sm text-gray-400 mb-3">{feature.desc}</p>
              <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">✓ {feature.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
