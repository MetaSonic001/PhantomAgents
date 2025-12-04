"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Play, ShoppingCart, Star, CheckCircle2, Copy, Heart, MessageSquare, TrendingUp } from "lucide-react"

const REVIEWS_KEY = "phantom.marketplace.reviews"

type Review = { id: string; user: string; rating: number; comment: string; date: string }

function readReviews(): Review[] {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

const mockAgent = {
  id: "1",
  name: "Crypto Trader Pro",
  creator: "TradeFi Labs",
  creatorAvatar: "👨‍💼",
  type: "Trading Agent",
  description: "Professional-grade trading agent that executes trades based on real-time market analysis.",
  rating: 4.8,
  reviewCount: 142,
  price: 99,
  trending: true,
  verified: true,
  capabilities: ["Real-time Price Monitoring", "Technical Analysis", "Automated Trading Signals", "Risk Management"],
}

export default function AgentDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = React.use(params)

  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)

  useEffect(() => setReviews(readReviews()), [])

  const submitReview = () => {
    const r: Review = { id: String(Date.now()), user: "You", rating, comment, date: new Date().toISOString() }
    const next = [r, ...reviews]
    setReviews(next)
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(next))
    setRating(5)
    setComment("")
  }

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(id || mockAgent.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const listing = mockAgent.id === id ? mockAgent : { ...mockAgent, id }

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition w-fit">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold">{listing.name}</h1>
                <p className="text-sm text-muted-foreground">by {listing.creator}</p>
              </div>
              <div className="flex items-center gap-3">
                {listing.verified && <CheckCircle2 className="w-6 h-6 text-primary" />}
                {listing.trending && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-700 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Trending
                  </span>
                )}
                <button onClick={() => setLiked(!liked)} className="p-2 rounded-md border border-border hover:bg-secondary transition">
                  <Heart className={`w-5 h-5 ${liked ? "fill-current text-red-500" : "text-muted-foreground"}`} />
                </button>
              </div>
            </div>

            <p className="text-foreground">{listing.description}</p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="border border-border rounded-lg p-4 bg-card text-center">
              <p className="text-xs text-muted-foreground">Rating</p>
              <p className="text-2xl font-bold">{listing.rating}</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card text-center">
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-2xl font-bold">${listing.price}</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card text-center">
              <p className="text-xs text-muted-foreground">Type</p>
              <p className="text-2xl font-bold">{listing.type}</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card text-center">
              <p className="text-xs text-muted-foreground">Reviews</p>
              <p className="text-2xl font-bold">{reviews.length || listing.reviewCount}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Capabilities</h2>
            <div className="grid grid-cols-2 gap-3">
              {listing.capabilities.map((cap: string) => (
                <div key={cap} className="flex items-center gap-2 p-3 border border-border rounded-lg bg-card">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm">{cap}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Recent Reviews</h2>
            <div className="space-y-4">
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
                  <button onClick={submitReview} className="px-3 py-2 bg-primary text-primary-foreground rounded">Submit</button>
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
          </div>
        </div>

        <aside className="space-y-6">
          <div className="border border-border rounded-lg p-6 bg-card sticky top-8">
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-2xl font-bold">${listing.price}</p>
            <div className="mt-4 space-y-2">
              <Link href={`/dashboard/marketplace/${id}/test`} className="w-full block text-center px-4 py-2 rounded-md bg-secondary hover:bg-secondary/90 transition font-medium">
                <Play className="inline w-4 h-4 mr-2" /> Test in Sandbox
              </Link>
              <Link href={`/dashboard/marketplace/${id}/checkout-demo`} className="w-full block text-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium">
                <ShoppingCart className="inline w-4 h-4 mr-2" /> Try / Buy (Demo)
              </Link>
            </div>
            <div className="mt-4">
              <button onClick={copyToClipboard} className="w-full py-2 px-4 border border-border rounded-md hover:bg-secondary transition font-medium flex items-center justify-center gap-2 text-sm">
                <Copy className="w-4 h-4" /> {copied ? "Copied" : "Copy ID"}
              </button>
            </div>
          </div>

          <div className="border border-border rounded-lg p-6 bg-card">
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wide text-muted-foreground">Creator</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg">{listing.creatorAvatar}</div>
              <div>
                <p className="font-semibold text-sm">{listing.creator}</p>
                <p className="text-xs text-muted-foreground">Verified Creator</p>
              </div>
            </div>
            <button className="w-full py-2 px-4 border border-border rounded-md hover:bg-secondary transition font-medium text-sm flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" /> Contact
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
