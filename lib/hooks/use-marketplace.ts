"use client"

import { useState, useEffect } from "react"
import { marketplaceApi } from "@/lib/api-client"
import type { MarketplaceAgent } from "@/lib/types"

export function useMarketplace(category?: string, sortBy?: string) {
  const [agents, setAgents] = useState<MarketplaceAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true)
        const params: Record<string, string> = {}
        if (category && category !== "All") params.category = category
        if (sortBy) params.sortBy = sortBy

        const data = await marketplaceApi.getAll(params)
        setAgents(data.agents || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch marketplace agents")
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [category, sortBy])

  return { agents, loading, error }
}
