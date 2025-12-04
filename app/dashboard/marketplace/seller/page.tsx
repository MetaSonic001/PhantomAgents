"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Plus, Trash2, Edit, CreditCard } from "lucide-react"

type Listing = {
  id: string
  title: string
  price: string
  description: string
  created: string
}

const STORAGE_KEY = "phantom.seller.listings"

function readListings(): Listing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export default function SellerDashboard() {
  const [listings, setListings] = useState<Listing[]>([])
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [desc, setDesc] = useState("")

  useEffect(() => {
    setListings(readListings())
  }, [])

  const save = (next: Listing[]) => {
    setListings(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const handleCreate = () => {
    if (!title.trim()) return
    const newL: Listing = { id: String(Date.now()), title, price: price || "$0/month", description: desc, created: new Date().toISOString() }
    save([newL, ...listings])
    setTitle("")
    setPrice("")
    setDesc("")
  }

  const handleDelete = (id: string) => {
    const next = listings.filter((l) => l.id !== id)
    save(next)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Seller Dashboard</h1>
                <p className="text-muted-foreground">Manage your listings and demo payments</p>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md">
                <CreditCard className="w-4 h-4" />
                Demo Payments
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 border border-border rounded-lg p-4 bg-card">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Plus className="w-4 h-4" /> Create Listing</h3>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full px-3 py-2 border border-border rounded mb-2" />
                <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (e.g. $49/month)" className="w-full px-3 py-2 border border-border rounded mb-2" />
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Short description" className="w-full px-3 py-2 border border-border rounded mb-2" rows={4} />
                <div className="flex gap-2">
                  <button onClick={handleCreate} className="px-3 py-2 bg-primary text-primary-foreground rounded">Create</button>
                  <button onClick={() => { setTitle(""); setPrice(""); setDesc("") }} className="px-3 py-2 border border-border rounded">Clear</button>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                {listings.length === 0 && (
                  <div className="border border-border rounded-lg p-6 bg-card text-muted-foreground">No listings yet — create your first listing.</div>
                )}

                {listings.map((l) => (
                  <div key={l.id} className="border border-border rounded-lg p-4 bg-background flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{l.title} <span className="text-xs text-muted-foreground">{l.price}</span></h3>
                      <p className="text-sm text-muted-foreground">{l.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">Created: {new Date(l.created).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a className="px-3 py-1 border border-border rounded hover:bg-secondary text-sm" href={`/dashboard/marketplace/${l.id}/checkout-demo`}>
                        Demo Buy
                      </a>
                      <button onClick={() => handleDelete(l.id)} className="px-3 py-1 border border-destructive text-destructive rounded">Delete</button>
                    </div>
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
