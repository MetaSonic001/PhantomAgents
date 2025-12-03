export async function GET() {
  return Response.json({
    agents: [
      {
        id: "1",
        name: "Crypto Trader Pro",
        type: "Trading Agent",
        status: "active",
        created: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        name: "Market Oracle",
        type: "Prediction Oracle",
        status: "active",
        created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })
}

export async function POST(request: Request) {
  const body = await request.json()

  return Response.json(
    {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      created: new Date().toISOString(),
      status: "draft",
    },
    { status: 201 },
  )
}
