export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return Response.json({ error: "Missing email or password" }, { status: 400 })
  }

  // Mock authentication - in production, verify against database
  return Response.json({
    user: {
      id: "1",
      email,
      name: "User",
    },
    token: "mock_jwt_token_" + Math.random().toString(36).substr(2, 9),
  })
}
