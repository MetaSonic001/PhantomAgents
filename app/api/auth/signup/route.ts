export async function POST(request: Request) {
  const { email, password, name } = await request.json()

  if (!email || !password || !name) {
    return Response.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Mock user creation - in production, create in database
  return Response.json(
    {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
      },
      token: "mock_jwt_token_" + Math.random().toString(36).substr(2, 9),
    },
    { status: 201 },
  )
}
