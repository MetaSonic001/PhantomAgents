export async function GET(request: Request, { params }: { params: { id: string } }) {
  return Response.json({
    id: params.id,
    name: "Crypto Trader Pro",
    creator: "TradeFi Labs",
    type: "Trading Agent",
    rating: 4.8,
    reviews: 142,
    price: 99,
    users: 324,
    successRate: "89%",
    avgReturn: "+22.5%",
    uptime: "99.8%",
  })
}
