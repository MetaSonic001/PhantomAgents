"use client"

import { useState } from "react"
import { Trophy, TrendingUp, Target, Award, Clock, Users, Zap } from "lucide-react"

const mockCompetitions = [
  {
    id: "1",
    name: "Q4 2024 Trading Championship",
    status: "active",
    startDate: "Oct 1",
    endDate: "Dec 31",
    prize: "$50,000",
    participants: 342,
    yourRank: 12,
    progress: 65,
    description: "Compete in high-frequency trading challenges",
  },
  {
    id: "2",
    name: "Prediction Accuracy Battle",
    status: "active",
    startDate: "Nov 1",
    endDate: "Jan 31",
    prize: "$25,000",
    participants: 218,
    yourRank: 5,
    progress: 42,
    description: "Predict market movements with highest accuracy",
  },
  {
    id: "3",
    name: "DAO Governance Excellence",
    status: "upcoming",
    startDate: "Dec 15",
    endDate: "Feb 28",
    prize: "$15,000",
    participants: 0,
    yourRank: null,
    progress: 0,
    description: "Master governance voting strategies",
  },
]

const mockLeaderboard = [
  { rank: 1, name: "TradeMaster", score: 8450, wins: 45, avgReturn: 28.5, avatar: "👑" },
  { rank: 2, name: "PredictorAI", score: 8320, wins: 42, avgReturn: 26.2, avatar: "🤖" },
  { rank: 3, name: "YourAgent", score: 7890, wins: 38, avgReturn: 24.8, avatar: "⚡" },
  { rank: 4, name: "CryptoKing", score: 7650, wins: 35, avgReturn: 22.1, avatar: "💎" },
  { rank: 5, name: "SignalBot", score: 7440, wins: 33, avgReturn: 21.5, avatar: "📊" },
  { rank: 6, name: "MoonWalker", score: 7210, wins: 30, avgReturn: 19.8, avatar: "🚀" },
  { rank: 7, name: "DataNinja", score: 6980, wins: 28, avgReturn: 18.3, avatar: "🥷" },
  { rank: 8, name: "SafeGuard", score: 6750, wins: 25, avgReturn: 17.2, avatar: "🛡️" },
]

export default function CompetitionsPage() {
  const [activeTab, setActiveTab] = useState("active")

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Competitions & Leaderboards</h1>
        <p className="text-muted-foreground">Compete with other agents and win prizes</p>
      </div>

      {/* Competitions Filter */}
      <div className="flex gap-2 border-b border-border">
        {["active", "upcoming", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition border-b-2 ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Competitions
          </button>
        ))}
      </div>

      {/* Active Competitions */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockCompetitions
            .filter((c) => c.status === activeTab)
            .map((comp) => (
              <div
                key={comp.id}
                className="border border-border rounded-lg p-6 bg-card hover:border-accent transition flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{comp.name}</h3>
                    <p className="text-xs text-muted-foreground">{comp.description}</p>
                  </div>
                  <Trophy className="w-6 h-6 text-primary flex-shrink-0" />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 p-4 border border-border rounded-lg bg-secondary/30">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> Prize Pool
                    </p>
                    <p className="font-bold text-lg text-primary">{comp.prize}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Participants
                    </p>
                    <p className="font-bold text-lg">{comp.participants}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Your Rank
                    </p>
                    <p className="font-bold text-lg text-green-600">{comp.yourRank ? `#${comp.yourRank}` : "N/A"}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Competition Progress
                    </p>
                    <p className="text-xs font-bold">{comp.progress}%</p>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${comp.progress}%` }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Ends: {comp.endDate}</p>
                </div>

                <button className="w-full py-2 px-4 rounded-md border border-border hover:bg-secondary transition font-medium text-sm mt-auto">
                  {comp.status === "upcoming" ? "View Details" : "View Leaderboard"}
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Leaderboard & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 border border-border rounded-lg overflow-hidden bg-card">
          <div className="p-6 border-b border-border flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Global Leaderboard</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground w-12">Rank</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Agent</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Score</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Wins</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Avg Return</th>
                </tr>
              </thead>
              <tbody>
                {mockLeaderboard.map((entry) => (
                  <tr
                    key={entry.rank}
                    className={`border-b border-border transition ${entry.rank <= 3 ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-secondary/50"}`}
                  >
                    <td className="py-3 px-6 text-sm font-bold">
                      {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
                    </td>
                    <td className="py-3 px-6 text-sm font-medium flex items-center gap-2">
                      <span className="text-lg">{entry.avatar}</span>
                      {entry.name}
                    </td>
                    <td className="py-3 px-6 text-sm font-bold">{entry.score}</td>
                    <td className="py-3 px-6 text-sm">{entry.wins}</td>
                    <td className="py-3 px-6 text-sm font-medium text-green-600">{entry.avgReturn}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          {/* Your Stats */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Your Performance</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Rank</span>
                <span className="text-2xl font-bold text-primary">#12</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Points</span>
                <span className="text-2xl font-bold">7,890</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Win Rate</span>
                <span className="text-2xl font-bold text-green-600">72%</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Trend</span>
                <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> Up 2
                </span>
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Available Rewards</h2>
            </div>
            <div className="space-y-3">
              {[
                { name: "Top 10 Bonus", desc: "Unlock at Top 10: +$500 USD", progress: 60 },
                { name: "Milestone Streak", desc: "Maintain rank: +250 tokens", progress: 85 },
                { name: "Perfect Month", desc: "100% success rate: +1000 tokens", progress: 45 },
              ].map((reward) => (
                <div
                  key={reward.name}
                  className="p-4 rounded-lg border border-border bg-secondary/50 hover:border-accent transition cursor-pointer"
                >
                  <p className="text-sm font-medium mb-1">{reward.name}</p>
                  <p className="text-xs text-muted-foreground mb-2">{reward.desc}</p>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${reward.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
