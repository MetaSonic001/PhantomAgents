"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RedirectToRuns() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/dashboard/agents/runs")
  }, [router])
  return null
}
