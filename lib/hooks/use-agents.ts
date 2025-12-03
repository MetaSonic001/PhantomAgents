"use client"

import { useState, useEffect } from "react"
import { agentApi } from "@/lib/api-client"
import type { Agent } from "@/lib/types"

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true)
        const data = await agentApi.getAll()
        setAgents(data.agents || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch agents")
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  return { agents, loading, error }
}

export function useAgent(id: string) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true)
        const data = await agentApi.getById(id)
        setAgent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch agent")
      } finally {
        setLoading(false)
      }
    }

    fetchAgent()
  }, [id])

  return { agent, loading, error }
}
