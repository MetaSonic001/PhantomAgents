"use client"

import { useState } from "react"
import { Search, Download, Star, Zap } from "lucide-react"
import Link from "next/link"

const templates = [
  {
    id: "1",
    name: "Sales Lead Qualifier",
    category: "business",
    description: "Automatically qualify and prioritize sales leads",
    downloads: 2540,
    rating: 4.8,
    tags: ["CRM", "Sales", "Automation"],
  },
  {
    id: "2",
    name: "Customer Support Triager",
    category: "business",
    description: "Route support tickets to appropriate teams",
    downloads: 1890,
    rating: 4.7,
    tags: ["Support", "Routing", "NLP"],
  },
  {
    id: "3",
    name: "Portfolio Rebalancer",
    category: "finance",
    description: "Automatically rebalance investment portfolios",
    downloads: 856,
    rating: 4.9,
    tags: ["Finance", "Trading", "API"],
  },
  {
    id: "4",
    name: "Arbitrage Scanner",
    category: "trading",
    description: "Detect arbitrage opportunities across exchanges",
    downloads: 1245,
    rating: 4.6,
    tags: ["Trading", "DeFi", "Real-time"],
  },
  {
    id: "5",
    name: "Market Research Agent",
    category: "research",
    description: "Gather and analyze market research data",
    downloads: 2103,
    rating: 4.8,
    tags: ["Research", "Data", "Analysis"],
  },
  {
    id: "6",
    name: "DAO Proposal Analyzer",
    category: "governance",
    description: "Analyze and vote on DAO proposals",
    downloads: 678,
    rating: 4.7,
    tags: ["Governance", "DAO", "Blockchain"],
  },
]

const categories = ["All", "Business", "Finance", "Trading", "Research", "Governance"]

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredTemplates = templates.filter(
    (t) =>
      (selectedCategory === "All" || t.category === selectedCategory.toLowerCase()) &&
      (t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Agent Templates</h1>
        <p className="text-foreground/60">Ready-made blueprints to accelerate agent creation</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Link
            key={template.id}
            href={`/builder?template=${template.id}`}
            className="group border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-lg transition bg-background"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold group-hover:text-primary transition">{template.name}</h3>
                  <span className="inline-block px-2 py-1 text-xs rounded bg-secondary text-secondary-foreground">
                    {template.category}
                  </span>
                </div>
                <Zap className="w-4 h-4 text-foreground/40" />
              </div>

              {/* Description */}
              <p className="text-sm text-foreground/60">{template.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-secondary/50 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4 text-xs text-foreground/60">
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {template.downloads}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    {template.rating}
                  </div>
                </div>
                <div className="text-xs font-medium text-primary group-hover:translate-x-1 transition">Use →</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground/60">No templates found matching your search</p>
        </div>
      )}
    </div>
  )
}
