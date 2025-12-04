"use client"

import * as React from "react"

async function sha256Hex(text: string) {
  const enc = new TextEncoder()
  const data = enc.encode(text)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export default function RAGSources({ agentName }: { agentName?: string }) {
  const key = `phantom.agent.${agentName || "default"}.rag`
  const [files, setFiles] = React.useState<Array<{ name: string; hash: string }>>([])

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) setFiles(JSON.parse(raw))
    } catch (e) {}
  }, [key])

  const handleFile = async (f: File) => {
    const text = await f.text()
    const h = await sha256Hex(text || "")
    const next = [...files, { name: f.name, hash: h }]
    setFiles(next)
    localStorage.setItem(key, JSON.stringify(next))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">RAG Sources</h3>
      <p className="text-sm text-muted-foreground">Upload documents to be used as retrieval-augmented sources. Files are hashed locally and stored as placeholders for an offline indexer.</p>

      <div>
        <input
          type="file"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
      </div>

      <div className="space-y-2">
        {files.map((f, i) => (
          <div key={i} className="flex items-center justify-between p-2 border rounded">
            <div>
              <div className="font-medium">{f.name}</div>
              <div className="text-xs text-muted-foreground font-mono">{f.hash}</div>
            </div>
          </div>
        ))}
        {files.length === 0 && <div className="text-sm text-muted-foreground">No RAG sources added.</div>}
      </div>
    </div>
  )
}
