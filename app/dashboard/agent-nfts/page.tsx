"use client"

import { useState } from "react"
import { ShoppingCart, Flame } from "lucide-react"

export default function AgentNFTsPage() {
  const [agentNFTs] = useState([
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
  ])

  const [tokenEconomics] = useState({
    totalSupply: 1000000,
    circulatingSupply: 450000,
    stakingRewards: 15.5,
    governanceVotes: 128,
    treasuryValue: 245000,
  })

  const stakingInfo = [
    { period: "30 Days", apy: "12.5%", minStake: 100 },
    { period: "90 Days", apy: "18.3%", minStake: 500 },
    { period: "180 Days", apy: "24.5%", minStake: 1000 },
    { period: "365 Days", apy: "35.2%", minStake: 2000 },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Agent NFTs & Token Economy</h1>
        <p className="text-muted-foreground">Trade, stake, and own AI agents as digital assets</p>
      </div>

      {/* Token Economics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground mb-1">Total Supply</p>
          <p className="text-2xl font-bold">{tokenEconomics.totalSupply.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">PA Tokens</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground mb-1">Circulating</p>
          <p className="text-2xl font-bold">{(tokenEconomics.circulatingSupply / 1000).toFixed(0)}K</p>
          <p className="text-xs text-muted-foreground mt-1">
            {((tokenEconomics.circulatingSupply / tokenEconomics.totalSupply) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground mb-1">Staking APY</p>
          <p className="text-2xl font-bold text-green-600">{tokenEconomics.stakingRewards}%</p>
          <p className="text-xs text-muted-foreground mt-1">Current average</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground mb-1">Governance Votes</p>
          <p className="text-2xl font-bold">{tokenEconomics.governanceVotes}</p>
          <p className="text-xs text-muted-foreground mt-1">Active proposals</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground mb-1">Treasury Value</p>
          <p className="text-2xl font-bold">${(tokenEconomics.treasuryValue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-muted-foreground mt-1">DAO reserves</p>
        </div>
      </div>

      {/* Staking Opportunities */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5" />
          Staking Opportunities
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          {stakingInfo.map((stake, idx) => (
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

      {/* NFT Marketplace */}
      <div className="border border-border rounded-lg bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Agent NFT Marketplace
          </h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition text-sm font-medium">
              All
            </button>
            <button className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition text-sm font-medium">
              Listed
            </button>
            <button className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition text-sm font-medium">
              My Collection
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {agentNFTs.map((nft) => (
            <div
              key={nft.id}
              className="border border-border rounded-lg overflow-hidden hover:border-accent transition"
            >
              <div className="aspect-square bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center text-6xl">
                {nft.image}
              </div>
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
                    <span key={idx} className="px-2 py-1 border border-border rounded text-muted-foreground">
                      {trait}
                    </span>
                  ))}
                </div>

                <button
                  className={`w-full px-4 py-2 rounded-md font-medium text-sm transition ${
                    nft.listed
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border hover:bg-secondary"
                  }`}
                >
                  {nft.listed ? "Buy Now" : "Make Offer"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
