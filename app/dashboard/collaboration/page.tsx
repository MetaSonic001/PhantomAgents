"use client"

import { useState } from "react"
import { MessageSquare, CheckCircle } from "lucide-react"

const mockAgents = [
  { id: "1", name: "Trading Agent V2", collaborators: 3 },
  { id: "2", name: "Research Assistant", collaborators: 2 },
]

const mockComments = [
  {
    id: "1",
    user: "Alice Johnson",
    content: "Should we add rate limiting to prevent API abuse?",
    timestamp: "2 hours ago",
    resolved: false,
  },
  {
    id: "2",
    user: "Bob Smith",
    content: "Great idea! I'll add that to the next version.",
    timestamp: "1 hour ago",
    resolved: false,
  },
]

const mockChangeRequests = [
  {
    id: "1",
    agent: "Trading Agent",
    proposedBy: "Alice",
    changes: "Add confidence threshold slider",
    status: "pending",
    date: "2 hours ago",
  },
  {
    id: "2",
    agent: "Research Assistant",
    proposedBy: "Bob",
    changes: "Integrate with new API",
    status: "approved",
    date: "1 day ago",
  },
]

export default function CollaborationPage() {
  const [comments, setComments] = useState(mockComments)
  const [changeRequests, setChangeRequests] = useState(mockChangeRequests)
  const [newComment, setNewComment] = useState("")

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: String(comments.length + 1),
          user: "You",
          content: newComment,
          timestamp: "just now",
          resolved: false,
        },
      ])
      setNewComment("")
    }
  }

  const toggleResolve = (id: string) => {
    setComments(comments.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c)))
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Team Collaboration</h1>
        <p className="text-foreground/60">Collaborate with your team on agent development</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Comments & Annotations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border rounded-lg p-6 bg-background">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Comments & Annotations
            </h2>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-4 border border-border rounded-lg ${
                    comment.resolved ? "bg-secondary/30" : "bg-background"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{comment.user}</p>
                      <p className="text-xs text-foreground/60">{comment.timestamp}</p>
                    </div>
                    <button
                      onClick={() => toggleResolve(comment.id)}
                      className={`p-2 rounded transition ${
                        comment.resolved ? "text-green-600 bg-green-50" : "text-foreground/40 hover:text-foreground/60"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-secondary rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                    rows={3}
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Change Requests */}
          <div className="border border-border rounded-lg p-6 bg-background">
            <h2 className="text-xl font-semibold mb-4">Change Requests</h2>

            <div className="space-y-3">
              {changeRequests.map((request) => (
                <div key={request.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{request.changes}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                          request.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/60">
                      {request.proposedBy} • {request.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Agents */}
          <div className="border border-border rounded-lg p-6 bg-background">
            <h3 className="font-semibold mb-4">Shared Agents</h3>
            <div className="space-y-3">
              {mockAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-secondary/30 transition cursor-pointer"
                >
                  <div className="w-8 h-8 bg-primary rounded-md"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{agent.name}</p>
                    <p className="text-xs text-foreground/60">{agent.collaborators} members</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Activity */}
          <div className="border border-border rounded-lg p-6 bg-background">
            <h3 className="font-semibold mb-4">Team Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <div className="w-1 bg-primary rounded-full"></div>
                <div>
                  <p className="font-medium">Alice updated Trading Agent</p>
                  <p className="text-xs text-foreground/60">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1 bg-primary rounded-full"></div>
                <div>
                  <p className="font-medium">Bob commented on Research Assistant</p>
                  <p className="text-xs text-foreground/60">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
