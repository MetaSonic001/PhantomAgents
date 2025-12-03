export async function GET(request: Request, { params }: { params: { id: string } }) {
  return Response.json({
    id: params.id,
    name: "Crypto Trader Pro",
    type: "Trading Agent",
    status: "active",
    description: "Professional-grade trading agent",
    created: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()

  return Response.json({
    id: params.id,
    ...body,
    updated: new Date().toISOString(),
  })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return Response.json({ success: true, id: params.id })
}
