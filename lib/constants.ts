export const AGENT_TYPES = [
  "Trading Agent",
  "Prediction Oracle",
  "Governance Delegate",
  "Research Assistant",
  "Task Manager",
  "Social Agent",
  "Custom",
]

export const PERSONALITY_TRAITS = [
  "Analytical",
  "Aggressive",
  "Cautious",
  "Humorous",
  "Formal",
  "Creative",
  "Data-Driven",
]

export const MARKETPLACE_CATEGORIES = ["All", "Trading", "Research", "Governance", "Productivity", "Social"]

export const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
]

export const PRICING_PLANS = [
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
]
