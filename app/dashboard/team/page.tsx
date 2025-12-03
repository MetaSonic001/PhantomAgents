"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Shield, UserCheck } from "lucide-react"

export default function TeamPage() {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")

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

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    setInviteEmail("")
    setShowInvite(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Team Management</h1>
                <p className="text-muted-foreground">Manage team members and permissions</p>
              </div>
              <button
                onClick={() => setShowInvite(!showInvite)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
              >
                <Plus className="w-4 h-4" />
                Invite Member
              </button>
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
                    <select className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
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

            <div className="grid gap-6 mb-8">
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
            <div className="space-y-3">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-secondary/20 transition"
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
          </div>
        </main>
      </div>
    </div>
  )
}
