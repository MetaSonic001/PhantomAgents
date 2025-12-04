"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Trash2, CheckCircle2, AlertCircle, Info } from "lucide-react"

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all")

  const initialNotifications = [
    {
      id: "notif_001",
      type: "success",
      title: "Agent Deployed Successfully",
      message: "Your Trading Bot v2.1 has been deployed to production",
      timestamp: "5 minutes ago",
      read: false,
      icon: CheckCircle2,
    },
    {
      id: "notif_002",
      type: "warning",
      title: "High Error Rate Detected",
      message: "Market Analysis agent has 12% error rate in the last hour",
      timestamp: "1 hour ago",
      read: false,
      icon: AlertCircle,
    },
    {
      id: "notif_003",
      type: "info",
      title: "New Competition Available",
      message: "Join the Q4 Trading Championship with $50K prize pool",
      timestamp: "3 hours ago",
      read: true,
      icon: Info,
    },
    {
      id: "notif_004",
      type: "success",
      title: "Revenue Generated",
      message: "Your agents earned $234.56 from marketplace rentals this week",
      timestamp: "1 day ago",
      read: true,
      icon: CheckCircle2,
    },
    {
      id: "notif_005",
      type: "warning",
      title: "API Rate Limit Warning",
      message: "You're approaching API rate limits. Consider upgrading your plan.",
      timestamp: "2 days ago",
      read: true,
      icon: AlertCircle,
    },
  ]

  const [notifications, setNotifications] = useState(initialNotifications)

  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.type === filter)

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your agents and activity</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition font-medium text-sm"
        >
          Mark all as read
        </button>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        {["all", "unread", "success", "warning", "info"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === status ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotifications.map((notif) => {
          const Icon = notif.icon
          return (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-4 border rounded-xl transition h-full ${
                notif.read ? "bg-card border-border" : "bg-primary/5 border-primary/30"
              } hover:border-accent`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  notif.type === "success"
                    ? "bg-green-500/10 text-green-600"
                    : notif.type === "warning"
                      ? "bg-yellow-500/10 text-yellow-600"
                      : "bg-blue-500/10 text-blue-600"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm">{notif.title}</p>
                  {!notif.read && (
                    <Badge variant="default" className="text-xs">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{notif.message}</p>
                <p className="text-xs text-muted-foreground">{notif.timestamp}</p>
              </div>
              <button
                onClick={() => deleteNotification(notif.id)}
                className="p-2 hover:bg-secondary rounded-lg transition shrink-0 text-muted-foreground"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
