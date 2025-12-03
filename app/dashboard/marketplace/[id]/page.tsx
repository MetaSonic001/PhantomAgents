"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Star, TrendingUp, MessageSquare, CheckCircle2, Copy, Heart } from "lucide-react"

// Mock agent details
const mockAgent = {
  id: "1",
  name: "Crypto Trader Pro",
  creator: "TradeFi Labs",
  creatorAvatar: "👨‍💼",
  type: "Trading Agent",
  description:
    "Professional-grade trading agent that executes trades based on real-time market analysis, technical indicators, and predefined strategies.",
  fullDescription: `
    Crypto Trader Pro is a sophisticated trading agent designed for automated cryptocurrency trading. It combines multiple technical analysis indicators with machine learning predictions to identify optimal entry and exit points.
    
    Features include real-time market monitoring, risk management protocols, and customizable trading strategies. The agent has been tested on historical data with consistent 18-24% monthly returns.
    
    Perfect for traders who want to automate their trading operations while maintaining full control and transparency.
  `,
  rating: 4.8,
  reviewCount: 142,
  price: 99,
  pricingModel: "/month",
  trending: true,
  verified: true,
  capabilities: [
    "Real-time Price Monitoring",
    "Technical Analysis",
    "Automated Trading Signals",
    "Risk Management",
    "Portfolio Tracking",
    "Performance Analytics",
  ],
  integrations: ["Binance", "Kraken", "Coinbase", "OKX"],
  stats: {
    users: 324,
    successRate: "89%",
    avgReturn: "+22.5%",
    uptime: "99.8%",
  },
  reviews: [
    {
      author: "Alex M.",
      rating: 5,
      text: "Best trading agent I've used. Solid returns and reliable.",
      date: "2 weeks ago",
      avatar: "👤",
    },
    {
      author: "Sarah K.",
      rating: 5,
      text: "The risk management is excellent. Feels safe using it.",
      date: "1 month ago",
      avatar: "👤",
    },
    {
      author: "Mike T.",
      rating: 4,
      text: "Great tool overall. Could use more customization options.",
      date: "2 months ago",
      avatar: "👤",
    },
  ],
  plans: [
    {
      name: "Starter",
      price: 49,
      features: ["Up to $10K portfolio", "2 strategies", "Basic analytics"],
    },
    {
      name: "Professional",
      price: 99,
      features: ["Up to $100K portfolio", "Unlimited strategies", "Advanced analytics", "Priority support"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: 249,
      features: ["Unlimited portfolio", "Custom strategies", "API access", "24/7 support"],
    },
  ],
}

export default function AgentDetailsPage({ params }: { params: { id: string } }) {
  const [selectedPlan, setSelectedPlan] = useState("Professional")
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)

  const copyToClipboard = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Back Button */}
      <Link
        href="/dashboard/marketplace"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </Link>

      {/* Hero Section */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Header */}
          <div className="border-b border-border pb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted"></div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{mockAgent.name}</h1>
                    {mockAgent.verified && <CheckCircle2 className="w-6 h-6 text-primary" />}
                    {mockAgent.trending && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-700 font-medium flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Trending
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3">{mockAgent.type}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(mockAgent.rating) ? "fill-primary text-primary" : "text-muted"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{mockAgent.rating}</span>
                      <span className="text-xs text-muted-foreground">({mockAgent.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setLiked(!liked)}
                className="p-2 rounded-md border border-border hover:bg-secondary transition"
              >
                <Heart className={`w-5 h-5 ${liked ? "fill-current text-red-500" : "text-muted-foreground"}`} />
              </button>
            </div>

            <p className="text-muted-foreground mb-3">
              Created by <span className="font-medium text-foreground">{mockAgent.creator}</span>
            </p>
            <p className="text-foreground">{mockAgent.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Active Users", value: mockAgent.stats.users },
              { label: "Success Rate", value: mockAgent.stats.successRate },
              { label: "Avg Return", value: mockAgent.stats.avgReturn },
              { label: "Uptime", value: mockAgent.stats.uptime },
            ].map((stat) => (
              <div key={stat.label} className="border border-border rounded-lg p-4 bg-card text-center">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Capabilities */}
          <div>
            <h2 className="text-xl font-bold mb-4">Capabilities</h2>
            <div className="grid grid-cols-2 gap-3">
              {mockAgent.capabilities.map((cap) => (
                <div key={cap} className="flex items-center gap-2 p-3 border border-border rounded-lg bg-card">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm">{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Integrations */}
          <div>
            <h2 className="text-xl font-bold mb-4">Integrations</h2>
            <div className="flex gap-3 flex-wrap">
              {mockAgent.integrations.map((integration) => (
                <div
                  key={integration}
                  className="px-4 py-2 rounded-full border border-border bg-card text-sm font-medium"
                >
                  {integration}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Reviews</h2>
            <div className="space-y-4">
              {mockAgent.reviews.map((review, i) => (
                <div key={i} className="border border-border rounded-lg p-4 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {review.avatar}
                      </div>
                      <p className="font-semibold">{review.author}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`w-3 h-3 ${j < review.rating ? "fill-primary text-primary" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Pricing & CTA */}
        <div className="space-y-6">
          {/* Pricing Cards */}
          <div className="border border-border rounded-lg p-6 bg-card sticky top-8">
            <h3 className="text-lg font-bold mb-4">Pricing Plans</h3>
            <div className="space-y-3 mb-6">
              {mockAgent.plans.map((plan) => (
                <label
                  key={plan.name}
                  className={`relative border ${selectedPlan === plan.name ? "border-primary bg-primary/5" : "border-border"} rounded-lg p-3 cursor-pointer transition hover:border-accent`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan.name}
                    checked={selectedPlan === plan.name}
                    onChange={() => setSelectedPlan(plan.name)}
                    className="sr-only"
                  />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">{plan.name}</p>
                      {plan.popular && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-primary mb-2">${plan.price}/month</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {plan.features.map((feature) => (
                        <p key={feature} className="flex items-center gap-1">
                          <span className="text-primary">✓</span> {feature}
                        </p>
                      ))}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <button className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium mb-3">
              Subscribe Now
            </button>
            <button
              onClick={copyToClipboard}
              className="w-full py-2 px-4 border border-border rounded-md hover:bg-secondary transition font-medium flex items-center justify-center gap-2 text-sm"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy ID"}
            </button>
          </div>

          {/* Creator */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wide text-muted-foreground">Creator</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg">
                {mockAgent.creatorAvatar}
              </div>
              <div>
                <p className="font-semibold text-sm">{mockAgent.creator}</p>
                <p className="text-xs text-muted-foreground">Verified Creator</p>
              </div>
            </div>
            <button className="w-full py-2 px-4 border border-border rounded-md hover:bg-secondary transition font-medium text-sm flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
