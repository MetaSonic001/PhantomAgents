"use client"

import { CreditCard, Download, AlertCircle } from "lucide-react"

export default function BillingPage() {
  const invoices = [
    { date: "2025-12-01", amount: "$99.00", status: "paid", id: "INV-2025-1201" },
    { date: "2025-11-01", amount: "$99.00", status: "paid", id: "INV-2025-1101" },
    { date: "2025-10-01", amount: "$99.00", status: "paid", id: "INV-2025-1001" },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing</p>
      </div>

      {/* Current Plan */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h2 className="text-xl font-bold mb-4">Current Plan</h2>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-semibold">Professional Plan</p>
            <p className="text-muted-foreground">$99/month</p>
            <p className="text-sm text-muted-foreground mt-2">Renews on January 1, 2026</p>
          </div>
          <button className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition font-medium">
            Change Plan
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="border border-border rounded-lg bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </h2>
          <button className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition text-sm font-medium">
            Update
          </button>
        </div>
        <div className="bg-secondary/30 p-4 rounded-lg">
          <p className="text-sm">Visa ending in 4242</p>
          <p className="text-xs text-muted-foreground mt-1">Expires 12/26</p>
        </div>
      </div>

      {/* Usage Alert */}
      <div className="border border-accent/50 rounded-lg bg-accent/5 p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Usage Limit Alert</p>
          <p className="text-sm text-muted-foreground">You're using 85% of your monthly agent runs limit</p>
        </div>
      </div>

      {/* Invoices */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h2 className="text-xl font-bold mb-4">Invoices</h2>
        <div className="space-y-2">
          {invoices.map((invoice, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-accent transition"
            >
              <div>
                <p className="font-medium text-sm">{invoice.id}</p>
                <p className="text-xs text-muted-foreground">{invoice.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded ${invoice.status === "paid" ? "bg-green-500/10 text-green-700" : "bg-yellow-500/10 text-yellow-700"}`}
                >
                  {invoice.status}
                </span>
                <p className="font-semibold">{invoice.amount}</p>
                <button className="p-2 hover:bg-secondary rounded transition">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
