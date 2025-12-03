"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RedirectToDocs() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/dashboard/docs")
  }, [router])
  return null
}
