"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Star, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

// Mock marketplace agents
const mockAgents = [
  {
    id: "1",
    name: "Crypto Trader Pro",
    creator: "TradeFi Labs",
    type: "Trading Agent",
    description: "Execute trades with real-time market analysis",
    rating: 4.8,
    reviews: 142,
    price: 99,
    trending: true,
    capabilities: ["Trading Signals", "Market Analysis", "Risk Management"],
  },
  {
    id: "2",
    name: "Market Oracle",
    creator: "Prediction.AI",
    type: "Prediction Oracle",
    description: "Real-time price and event predictions",
    rating: 4.6,
    reviews: 98,
    price: 79,
    capabilities: ["Price Forecasting", "Event Prediction", "Accuracy 92%"],
  },
  {
    id: "3",
    name: "DAO Delegate",
    creator: "Governance Labs",
    type: "Governance Delegate",
    description: "Participate in DAO governance automatically",
    rating: 4.9,
    reviews: 215,
    price: 49,
    trending: true,
    capabilities: ["Voting", "Proposal Analysis", "Vote Delegation"],
  },
  {
    id: "4",
    name: "Research Assistant",
    creator: "ResearchHub",
    type: "Research Assistant",
    description: "Generate comprehensive research reports",
    rating: 4.7,
    reviews: 156,
    price: 69,
    capabilities: ["Data Analysis", "Report Generation", "Citations"],
  },
  {
    id: "5",
    name: "Social Manager",
    creator: "SocialIO",
    type: "Social Agent",
    description: "Manage social media across platforms",
    rating: 4.5,
    reviews: 87,
    price: 59,
    capabilities: ["Multi-platform", "Scheduling", "Analytics"],
  },
  {
    id: "6",
    name: "Task Automator",
    creator: "WorkflowAI",
    type: "Task Manager",
    description: "Automate complex workflows and tasks",
    rating: 4.4,
    reviews: 72,
    price: 39,
    capabilities: ["Workflow Building", "Task Scheduling", "Logging"],
  },
]

const CATEGORIES = ["All", "Trading", "Research", "Governance", "Productivity", "Social"]

const MARKETPLACE_TABS = ["Listings", "NFTs"]

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("popular")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState(MARKETPLACE_TABS[0])

  const filteredAgents = mockAgents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || agent.type.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (sortBy === "popular") return b.reviews - a.reviews
    if (sortBy === "rating") return b.rating - a.rating
    if (sortBy === "newest") return 0
    if (sortBy === "price-low") return a.price - b.price
    return 0
  })

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold mb-2 text-white">Agent Marketplace</h1>
        <p className="text-gray-400">Discover and rent production-ready AI agents — listings, NFTs, and buying tools</p>
      </motion.div>

      {/* Tabs for Listings / NFTs */}
      <div className="flex gap-2">
        {MARKETPLACE_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === tab ? "bg-violet-600 text-white" : "border border-gray-700 text-gray-300 hover:bg-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2.5 rounded-md border border-gray-700 bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${
              selectedCategory === category
                ? "bg-violet-600 text-white"
                : "border border-gray-700 text-gray-300 hover:bg-gray-800"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Main content: switch between Listings and NFTs */}
      {activeTab === "Listings" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAgents.map((agent, index) => (
            <motion.div key={agent.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
              <Link
                href={`/dashboard/marketplace/${agent.id}`}
                className="rounded-2xl overflow-hidden hover:border-violet-500/30 transition group cursor-pointer bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-800 backdrop-blur-sm"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-800 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-violet-600 to-cyan-600"></div>
                      {agent.trending && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 font-medium flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Trending
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-base mb-1 text-white">{agent.name}</h3>
                    <p className="text-xs text-gray-400">{agent.creator}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <p className="text-sm text-gray-400 line-clamp-2">{agent.description}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(agent.rating) ? "fill-violet-400 text-violet-400" : "text-gray-600"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-white">{agent.rating}</span>
                    <span className="text-xs text-gray-400">({agent.reviews})</span>
                  </div>

                  {/* Capabilities */}
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.slice(0, 2).map((cap, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                        {cap}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div>
                      <p className="text-xs text-gray-400">From</p>
                      <p className="text-lg font-bold text-white">${agent.price}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                      }}
                      className="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 transition text-sm font-medium"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === "NFTs" && (
        <div className="space-y-6">
          {/* Token Economics Overview (copied from legacy NFTs page) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="border border-border rounded-lg p-4 bg-card">
              <p className="text-xs text-muted-foreground mb-1">Total Supply</p>
              <p className="text-2xl font-bold">1,000,000</p>
              <p className="text-xs text-muted-foreground mt-1">PA Tokens</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card">
              <p className="text-xs text-muted-foreground mb-1">Circulating</p>
              <p className="text-2xl font-bold">450K</p>
              <p className="text-xs text-muted-foreground mt-1">45.0%</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card">
              <p className="text-xs text-muted-foreground mb-1">Staking APY</p>
              <p className="text-2xl font-bold text-green-600">15.5%</p>
              <p className="text-xs text-muted-foreground mt-1">Current average</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card">
              <p className="text-xs text-muted-foreground mb-1">Governance Votes</p>
              <p className="text-2xl font-bold">128</p>
              <p className="text-xs text-muted-foreground mt-1">Active proposals</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card">
              <p className="text-xs text-muted-foreground mb-1">Treasury Value</p>
              <p className="text-2xl font-bold">$245K</p>
              <p className="text-xs text-muted-foreground mt-1">DAO reserves</p>
            </div>
          </div>

          {/* Staking Opportunities (copied) */}
          <div className="border border-border rounded-lg bg-card p-6">
            <h2 className="text-xl font-bold mb-4">Staking Opportunities</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { period: "30 Days", apy: "12.5%", minStake: 100 },
                { period: "90 Days", apy: "18.3%", minStake: 500 },
                { period: "180 Days", apy: "24.5%", minStake: 1000 },
                { period: "365 Days", apy: "35.2%", minStake: 2000 },
              ].map((stake, idx) => (
                <div key={idx} className="border border-border rounded-lg p-4 hover:border-accent transition">
                  <p className="font-semibold mb-3">{stake.period}</p>
                  <div className="space-y-2 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Annual APY</p>
                      <p className="text-2xl font-bold text-green-600">{stake.apy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Minimum Stake</p>
                      <p className="text-lg font-semibold">{stake.minStake.toLocaleString()} PA</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium text-sm">
                    Stake Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* NFT Marketplace copied UI */}
          <div className="border border-border rounded-lg bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Agent NFT Marketplace</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition text-sm font-medium">All</button>
                <button className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition text-sm font-medium">Listed</button>
                <button className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition text-sm font-medium">My Collection</button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  id: 1,
                  name: "Crypto Trader Pro V2",
                  creator: "TradeFi Labs",
                  floorPrice: 2.5,
                  volume: 45.3,
                  owners: 234,
                  rarity: "Rare",
                  traits: ["High-Performance", "Multi-Exchange", "Risk-Managed"],
                  image: "🤖",
                  listed: true,
                  royalty: 5,
                },
                {
                  id: 2,
                  name: "Market Oracle Elite",
                  creator: "Analytics Pro",
                  floorPrice: 1.8,
                  volume: 32.1,
                  owners: 156,
                  rarity: "Epic",
                  traits: ["Predictive", "ML-Powered", "Accurate"],
                  image: "🔮",
                  listed: true,
                  royalty: 7,
                },
                {
                  id: 3,
                  name: "DAO Governance Bot",
                  creator: "Governance Solutions",
                  floorPrice: 1.2,
                  volume: 18.5,
                  owners: 89,
                  rarity: "Uncommon",
                  traits: ["Automated Voting", "Delegate", "Transparent"],
                  image: "🏛️",
                  listed: false,
                  royalty: 3,
                },
              ].map((nft) => (
                <div key={nft.id} className="border border-border rounded-lg overflow-hidden hover:border-accent transition">
                  <div className="aspect-square bg-linear-to-br from-secondary to-secondary/50 flex items-center justify-center text-6xl">{nft.image}</div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold">{nft.name}</h3>
                      <p className="text-xs text-muted-foreground">{nft.creator}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-secondary/50 p-2 rounded">
                        <p className="text-muted-foreground">Floor</p>
                        <p className="font-semibold">{nft.floorPrice} ETH</p>
                      </div>
                      <div className="bg-secondary/50 p-2 rounded">
                        <p className="text-muted-foreground">Volume</p>
                        <p className="font-semibold">{nft.volume} ETH</p>
                      </div>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded">{nft.rarity}</span>
                      <span className="px-2 py-1 bg-secondary/50 rounded">{nft.owners} owners</span>
                    </div>

                    <div className="flex gap-2 text-xs flex-wrap">
                      {nft.traits.map((trait, idx) => (
                        <span key={idx} className="px-2 py-1 border border-border rounded text-muted-foreground">{trait}</span>
                      ))}
                    </div>

                    <button className={`w-full px-4 py-2 rounded-md font-medium text-sm transition ${nft.listed ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border hover:bg-secondary"}`}>
                      {nft.listed ? "Buy Now" : "Make Offer"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
