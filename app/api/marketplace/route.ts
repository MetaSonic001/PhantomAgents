export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const sortBy = searchParams.get("sortBy") || "popular"

  const agents = [
    {
      id: "1",
      name: "Crypto Trader Pro",
      creator: "TradeFi Labs",
      type: "Trading Agent",
      rating: 4.8,
      reviews: 142,
      price: 99,
      trending: true,
    },
    {
      id: "2",
      name: "Market Oracle",
      creator: "Prediction.AI",
      type: "Prediction Oracle",
      rating: 4.6,
      reviews: 98,
      price: 79,
    },
    {
      id: "3",
      name: "DAO Delegate",
      creator: "Governance Labs",
      type: "Governance Delegate",
      rating: 4.9,
      reviews: 215,
      price: 49,
      trending: true,
    },
  ]

  let filtered = agents
  if (category && category !== "All") {
    filtered = agents.filter((a) => a.type.includes(category))
  }

  if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating)
  } else if (sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price)
  }

  return Response.json({ agents: filtered, total: filtered.length })
}
