export async function GET() {
  return Response.json({
    competitions: [
      {
        id: "1",
        name: "Q4 2024 Trading Championship",
        status: "active",
        prize: 50000,
        participants: 342,
        endDate: "2024-12-31",
      },
      {
        id: "2",
        name: "Prediction Accuracy Battle",
        status: "active",
        prize: 25000,
        participants: 218,
        endDate: "2025-01-31",
      },
      {
        id: "3",
        name: "DAO Governance Excellence",
        status: "upcoming",
        prize: 15000,
        participants: 0,
        endDate: "2025-02-28",
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
      status: "active",
      createdAt: new Date().toISOString(),
    },
    { status: 201 },
  )
}
