"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Star } from "lucide-react"

type Review = { id: string; user: string; rating: number; comment: string; date: string }
const KEY = "phantom.marketplace.reviews"

function readReviews(): Review[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export default function MarketplaceReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

  useEffect(() => setReviews(readReviews()), [])

  const submit = () => {
    const r: Review = { id: String(Date.now()), user: "You", rating, comment, date: new Date().toISOString() }
    const next = [r, ...reviews]
    setReviews(next)
    localStorage.setItem(KEY, JSON.stringify(next))
    setRating(5)
    setComment("")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Marketplace Reviews</h1>
              <p className="text-muted-foreground">Read and submit reviews for marketplace agents</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1 border border-border rounded-lg p-4 bg-card">
                <h3 className="font-semibold mb-2">Leave a review</h3>
                <div className="flex gap-2 items-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} onClick={() => setRating(i + 1)} className={`text-xl ${i < rating ? "text-yellow-500" : "text-muted-foreground"}`}>
                      <Star />
                    </button>
                  ))}
                </div>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="w-full border border-border rounded mb-2 p-2" />
                <button onClick={submit} className="px-3 py-2 bg-primary text-primary-foreground rounded">Submit</button>
              </div>

              <div className="md:col-span-2 space-y-4">
                {reviews.length === 0 && <div className="border border-border rounded p-6 bg-card text-muted-foreground">No reviews yet.</div>}
                {reviews.map((r) => (
                  <div key={r.id} className="border border-border rounded p-4 bg-background">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">{r.user.charAt(0)}</div>
                        <div>
                          <p className="font-semibold">{r.user}</p>
                          <p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {Array.from({ length: r.rating }).map((_, i) => (<Star key={i} />))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
