"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RedirectToNetwork() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/dashboard/agents/network")
  }, [router])
  return null
}
