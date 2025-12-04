"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Shield, UserCheck, MessageSquare, CheckCircle } from "lucide-react"

export default function TeamPage() {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [activeTab, setActiveTab] = useState<"Members" | "Collaboration">("Members")

  // Collaboration mock data (migrated from collaboration page)
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

  const [comments, setComments] = useState(mockComments)
  const [changeRequests, setChangeRequests] = useState(mockChangeRequests)
  const [newComment, setNewComment] = useState("")

  const team = [
    {
      id: "user_1",
      name: "You",
      email: "john@phantom.ai",
      role: "owner",
      joined: "2024-01-15",
      avatar: "👤",
    },
    {
      id: "user_2",
      name: "Alice Chen",
      email: "alice@phantom.ai",
      role: "admin",
      joined: "2024-02-20",
      avatar: "👩‍💼",
    },
    {
      id: "user_3",
      name: "Bob Smith",
      email: "bob@phantom.ai",
      role: "editor",
      joined: "2024-03-10",
      avatar: "👨‍💻",
    },
    {
      id: "user_4",
      name: "Carol White",
      email: "carol@phantom.ai",
      role: "viewer",
      joined: "2024-03-25",
      avatar: "👩‍🔬",
    },
  ]

  const roles = [
    { id: "owner", label: "Owner", permissions: "Full access and billing" },
    { id: "admin", label: "Admin", permissions: "Manage agents and team" },
    { id: "editor", label: "Editor", permissions: "Create and edit agents" },
    { id: "viewer", label: "Viewer", permissions: "View-only access" },
  ]

  const [teamState, setTeamState] = useState(team)
  const [inviteRole, setInviteRole] = useState("editor")

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (inviteEmail.trim()) {
      setTeamState((prev) => [
        ...prev,
        {
          id: `user_${prev.length + 1}`,
          name: inviteEmail.split("@")[0] || "New Member",
          email: inviteEmail.trim(),
          role: inviteRole as any,
          joined: "Just now",
          avatar: "👤",
        },
      ])
    }
    setInviteEmail("")
    setShowInvite(false)
  }

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
      <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Team Management</h1>
                <p className="text-muted-foreground">Manage team members and permissions</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {(["Members", "Collaboration"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                        activeTab === t ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowInvite(!showInvite)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Invite Member
                </button>
              </div>
      </div>

      {showInvite && (
        <div className="mb-8 p-6 border border-border rounded-lg bg-card">
                <h3 className="font-semibold mb-4">Invite Team Member</h3>
                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Email</label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="team@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Role</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
                    >
                      Send Invite
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowInvite(false)}
                      className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
        </div>
      )}

      {activeTab === "Members" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {roles.map((role) => (
                    <div key={role.id} className="p-4 border border-border rounded-lg bg-card">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-muted-foreground" />
                        <h3 className="font-semibold">{role.label}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{role.permissions}</p>
                    </div>
                  ))}
          </div>

          <h2 className="text-xl font-bold mb-4">Team Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamState.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border border-border rounded-xl bg-card hover:bg-secondary/20 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{member.avatar}</div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          <p className="text-xs text-muted-foreground">Joined {member.joined}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={member.role === "owner" ? "default" : "secondary"}>{member.role}</Badge>
                        {member.role !== "owner" && (
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-secondary rounded-lg transition" title="Manage permissions">
                              <UserCheck className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 hover:bg-destructive/10 rounded-lg transition text-destructive"
                              title="Remove member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
          </div>
        </>
      )}

      {activeTab === "Collaboration" && (
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
                            request.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
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
      )}
    </div>
  )
}
