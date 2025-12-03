export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "30d"

  return Response.json({
    period,
    metrics: {
      totalActions: 12456,
      successRate: 94.2,
      avgResponseTime: 245,
      errorCount: 234,
      totalRevenue: 5847.9,
    },
    chart: {
      actionVolume: [
        { date: "2024-01-01", count: 120 },
        { date: "2024-01-02", count: 150 },
        { date: "2024-01-03", count: 180 },
      ],
      successRate: [
        { type: "Trading", rate: 89 },
        { type: "Prediction", rate: 92 },
        { type: "Governance", rate: 95 },
      ],
    },
  })
}
