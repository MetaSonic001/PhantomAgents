"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Redirect legacy Agent NFTs page into the consolidated Marketplace
export default function AgentNFTsRedirect() {
  const router = useRouter()

  useEffect(() => {
    // push to marketplace root — NFTs are now part of Marketplace
    router.replace("/dashboard/marketplace")
  }, [router])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Redirecting...</h1>
      <p className="text-sm text-muted-foreground">Agent NFTs have moved to the Marketplace. Redirecting you now.</p>
    </div>
  )
}
